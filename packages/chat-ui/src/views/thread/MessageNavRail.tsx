import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { MessageModel } from '../../models/MessageModel';
import { MessageNavJumpOptions } from './useMessageNavController';
import { chatClassNames } from '../core/chatClassNames';
import { useLocalizationContext } from '../core/LocalizationContext';
import { langReplace } from '../../locale/langReplace';
import { getMessageNavPreview } from './messageNavPreview';

export type MessageNavRailProps = {
  /**
   * User messages of the current branch — one rib per message.
   */
  userMessages: MessageModel[];
  /**
   * Index of the message the thread is currently scrolled to.
   */
  activeIndex: number;
  /**
   * Scroll container of the chat. When omitted the rail follows the window viewport.
   */
  contentRef?: React.RefObject<HTMLDivElement | null>;
  onJump: (index: number, options?: MessageNavJumpOptions) => void;
};

type LayoutType = {
  top: number;
  height: number;
  right: number;
};

const RAIL_WIDTH = 28;
const RAIL_RIGHT_INSET = 20;
const RAIL_VERTICAL_PADDING = 24;
/**
 * Ribs are spread across the rail, but never further apart than this — a short thread
 * should read as a compact group, not as a few marks stretched over the whole screen.
 */
const RIB_MAX_SPACING = 14;
const RIB_BASE_WIDTH = 10;
const RIB_MAX_WIDTH = 22;
const RIB_HEIGHT = 2;
/**
 * Distance (px) over which the dock magnification fades out. Kept close to a few rib
 * steps so the pointer has a clear focal point instead of widening the whole rail.
 */
const MAGNIFY_RADIUS = 42;
const DRAG_THRESHOLD = 4;
const PREVIEW_MAX_LENGTH = 120;
/**
 * Grab room above and below the ribs. The interactive area stops there instead of
 * spanning the container, so the rail never sits on top of the composer or the messages.
 */
const HIT_AREA_PADDING = 12;

const RailStyled = styled(Box)({
  position: 'fixed',
  width: RAIL_WIDTH,
  zIndex: 2,
  // Only the hit area below takes pointer events; the column itself must stay click-through
  pointerEvents: 'none',
});

const HitAreaStyled = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  pointerEvents: 'auto',
  touchAction: 'none',
  cursor: 'ns-resize',
});

const RibStyled = styled('button')(({ theme }) => ({
  position: 'absolute',
  right: 0,
  padding: 0,
  border: 'none',
  height: RIB_HEIGHT,
  width: RIB_BASE_WIDTH,
  borderRadius: RIB_HEIGHT,
  background: theme.palette.text.disabled,
  transform: 'translateY(-50%)',
  transition: theme.transitions.create(['background-color'], { duration: '150ms' }),
  // The hit area handles pointer interaction, ribs stay focusable for keyboard users
  pointerEvents: 'none',
  '&[data-active="true"]': {
    background: theme.palette.primary.main,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 4,
  },
}));

const PreviewStyled = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: RAIL_WIDTH,
  // The rail itself is only a narrow column — size the preview to its own content
  width: 'max-content',
  maxWidth: 220,
  padding: theme.spacing(0.75, 1.25),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.grey[700],
  color: theme.palette.common.white,
  fontSize: theme.typography.pxToRem(12),
  lineHeight: 1.4,
  pointerEvents: 'none',
  transform: 'translateY(-50%)',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

const MessageNavRail: React.FC<MessageNavRailProps> = ({ userMessages, activeIndex, contentRef, onJump }) => {
  const [layout, setLayout] = React.useState<LayoutType>();
  const [focusedIndex, setFocusedIndex] = React.useState<number>();

  const locale = useLocalizationContext();

  const railRef = React.useRef<HTMLDivElement | null>(null);
  const hitAreaRef = React.useRef<HTMLDivElement | null>(null);
  const ribsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const frameRef = React.useRef<number | undefined>(undefined);
  const reducedMotionRef = React.useRef(false);
  const dragRef = React.useRef<{ startY: number; moved: boolean; lastIndex: number } | undefined>(undefined);

  const count = userMessages.length;

  // Follow the scroll container: the rail is fixed, so it needs the container's viewport box
  React.useEffect(() => {
    const container = contentRef?.current;

    const update = () => {
      if (container) {
        const rect = container.getBoundingClientRect();

        setLayout({
          top: rect.top,
          height: rect.height,
          // `right` on a fixed element excludes the document scrollbar, innerWidth does not
          right: document.documentElement.clientWidth - rect.right,
        });
      } else {
        setLayout({ top: 0, height: window.innerHeight, right: 0 });
      }
    };

    update();

    const observer = container ? new ResizeObserver(update) : undefined;
    observer?.observe(container as HTMLDivElement);
    window.addEventListener('resize', update);
    // The container also moves without resizing when an ancestor page scrolls
    window.addEventListener('scroll', update, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [contentRef?.current]);

  React.useEffect(() => {
    reducedMotionRef.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const trackHeight = Math.max((layout?.height ?? 0) - RAIL_VERTICAL_PADDING * 2, 0);

  /**
   * Rib offsets inside the track, computed instead of measured — the rail is positioned,
   * so there is no need to read the DOM on every pointer move.
   */
  const offsets = React.useMemo(() => {
    if (!count || !trackHeight) return [];

    if (count === 1) return [trackHeight / 2];

    const spacing = Math.min(trackHeight / (count - 1), RIB_MAX_SPACING);
    const start = (trackHeight - spacing * (count - 1)) / 2;

    return Array.from({ length: count }, (_, index) => start + spacing * index);
  }, [count, trackHeight]);

  const hitArea = React.useMemo(() => {
    if (!offsets.length) return undefined;

    const first = offsets[0];
    const last = offsets[offsets.length - 1];

    return {
      top: RAIL_VERTICAL_PADDING + first - HIT_AREA_PADDING,
      height: (last - first) + HIT_AREA_PADDING * 2,
    };
  }, [offsets]);

  const getNearestIndex = React.useCallback((clientY: number) => {
    if (!layout || !offsets.length) return -1;

    const positionInTrack = clientY - layout.top - RAIL_VERTICAL_PADDING;

    let nearest = 0;
    let nearestDistance = Infinity;

    offsets.forEach((offset, index) => {
      const distance = Math.abs(offset - positionInTrack);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    return nearest;
  }, [layout, offsets]);

  const applyMagnification = React.useCallback((clientY: number | undefined) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      ribsRef.current.forEach((rib, index) => {
        if (!rib) return;

        if (clientY === undefined || reducedMotionRef.current || !layout) {
          rib.style.width = `${RIB_BASE_WIDTH}px`;
          return;
        }

        const ribY = layout.top + RAIL_VERTICAL_PADDING + (offsets[index] ?? 0);
        const distance = Math.min(Math.abs(clientY - ribY) / MAGNIFY_RADIUS, 1);
        // Cosine falloff: full size under the pointer, base size at the radius edge
        const falloff = (1 + Math.cos(Math.PI * distance)) / 2;

        rib.style.width = `${RIB_BASE_WIDTH + (RIB_MAX_WIDTH - RIB_BASE_WIDTH) * falloff}px`;
      });
    });
  }, [layout, offsets]);

  React.useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const endDrag = (pointerId?: number) => {
    if (pointerId !== undefined) {
      try {
        hitAreaRef.current?.releasePointerCapture(pointerId);
      } catch {
        // The capture is already gone — nothing to release
      }
    }

    dragRef.current = undefined;
  };

  const resetHover = () => {
    applyMagnification(undefined);
    setFocusedIndex(undefined);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const nearest = getNearestIndex(event.clientY);

    if (nearest === -1) return;

    applyMagnification(event.clientY);
    setFocusedIndex(nearest);

    const drag = dragRef.current;

    if (!drag) return;

    if (!drag.moved && Math.abs(event.clientY - drag.startY) > DRAG_THRESHOLD) {
      drag.moved = true;
    }

    if (drag.moved && drag.lastIndex !== nearest) {
      drag.lastIndex = nearest;
      onJump(nearest, { immediate: true });
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Secondary buttons open menus instead of completing, which would strand the drag
    if (event.button !== 0 || !event.isPrimary) return;

    hitAreaRef.current?.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, moved: false, lastIndex: -1 };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    endDrag(event.pointerId);

    if (!drag || drag.moved) return;

    const nearest = getNearestIndex(event.clientY);

    if (nearest !== -1) onJump(nearest);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
    resetHover();
  };

  const handlePointerLeave = () => {
    if (dragRef.current) return;

    resetHover();
  };

  const focusRib = (index: number) => {
    const rib = ribsRef.current[index];

    if (!rib || !layout) return;

    rib.focus();
    setFocusedIndex(index);
    applyMagnification(layout.top + RAIL_VERTICAL_PADDING + (offsets[index] ?? 0));
  };

  // The rail is a single tab stop; arrows move between ribs once you are inside it
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    const nextIndex = event.key === 'ArrowUp' ? activeIndex - 1 : activeIndex + 1;

    if (nextIndex < 0 || nextIndex > count - 1) return;

    event.preventDefault();
    onJump(nextIndex);
    focusRib(nextIndex);
  };

  if (!layout || !count) return null;

  const previewIndex = focusedIndex ?? -1;
  const previewText = getMessageNavPreview(userMessages[previewIndex], PREVIEW_MAX_LENGTH);

  return (
    <RailStyled
      ref={railRef}
      className={chatClassNames.messageNavRail}
      style={{
        top: layout.top,
        height: layout.height,
        right: layout.right + RAIL_RIGHT_INSET,
      }}
      role="navigation"
      aria-label={locale.messageNavTitle}
      onKeyDown={handleKeyDown}
    >
      {!!hitArea && (
        <HitAreaStyled
          ref={hitAreaRef}
          style={{ top: hitArea.top, height: hitArea.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
        />
      )}
      {userMessages.map((message, index) => (
        <RibStyled
          key={message.id}
          ref={(element) => { ribsRef.current[index] = element; }}
          type="button"
          data-active={index === activeIndex}
          style={{ top: RAIL_VERTICAL_PADDING + (offsets[index] ?? 0) }}
          tabIndex={index === activeIndex ? 0 : -1}
          aria-label={getMessageNavPreview(message, PREVIEW_MAX_LENGTH) || langReplace(locale.messageNavItem, { number: index + 1 })}
          aria-current={index === activeIndex || undefined}
          onFocus={() => setFocusedIndex(index)}
          onBlur={handlePointerLeave}
          onClick={() => onJump(index)}
        />
      ))}
      {!!previewText && (
        <PreviewStyled style={{ top: RAIL_VERTICAL_PADDING + (offsets[previewIndex] ?? 0) }}>
          {previewText}
        </PreviewStyled>
      )}
    </RailStyled>
  );
}

export default MessageNavRail;
