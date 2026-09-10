import * as React from 'react';
import type SimpleBarCore from 'simplebar-core';
import { Thread } from '../../../models';
import { Threads } from '../../../models/Threads';
import { ThreadListFlatItem, ThreadListProjection } from '../../../models/ThreadListGroupItem';
import { HistorySlotPropsType, HistorySlotType } from '../../core/history/HistoryType';
import { historyClassNames } from '../../core/history/historyClassNames';
import { useHistoryContext } from '../../core/history/HistoryContext';
import { useElementSize } from '../../hooks/useElementSize';
import TimeGroupItem from '../TimeGroupItem';
import ThreadListItem from '../ThreadListItem';
import ThreadListRowRoot from './ThreadListRowRoot';
import { useHistoryVirtualizer } from './useHistoryVirtualizer';

type Props = {
  projection: ThreadListProjection;
  /** simplebar's real scroll node. */
  scrollElement: HTMLElement | null;
  scrollbar: SimpleBarCore | null;
  /** The flex box that owns the list viewport; the only height we control. */
  viewportElement: HTMLElement | null;
  currentThreadKey?: string;
  model: Threads<any, any>;
  setThread: (thread: Thread) => void;
  slots: HistorySlotType;
  slotProps: Partial<HistorySlotPropsType>;
};

type RenderMode = 'flow' | 'virtual' | 'idle';

const useDevHeightCheck = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  itemHeight: number,
  groupHeaderHeight: number,
) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const check = (selector: string, expected: number, propName: string) => {
      const element = container.querySelector<HTMLElement>(`.${selector}`);
      if (!element) return;
      if (Math.abs(element.offsetHeight - expected) > 1) {
        console.error(
          `Chat UI: history ".${selector}" measures ${element.offsetHeight}px but `
          + `historyProps.${propName} is ${expected}px. Virtualized rows will drift. `
          + `Set historyProps.${propName}, or turn off historyProps.enableVirtualization.`,
        );
      }
    };

    check(historyClassNames.listItem, itemHeight, 'itemHeight');
    check(historyClassNames.listTimeTextWrapper, groupHeaderHeight, 'groupHeaderHeight');
  }, [containerRef, enabled, itemHeight, groupHeaderHeight]);
};

const ThreadListBody: React.FC<Props> = ({
  projection,
  scrollElement,
  scrollbar,
  viewportElement,
  currentThreadKey,
  model,
  setThread,
  slots,
  slotProps,
}) => {
  const { threadTypeIcons, enableVirtualization, itemHeight, groupHeaderHeight } = useHistoryContext();
  const { items } = projection;

  const sizerRef = React.useRef<HTMLDivElement | null>(null);
  const [sizerElement, setSizerElement] = React.useState<HTMLDivElement | null>(null);

  const { width: viewportWidth, height: viewportHeight } = useElementSize(
    viewportElement,
    enableVirtualization,
  );

  // A zero viewport is not the only way the height chain fails, and not even the
  // common one. When the chain is broken simplebar writes `height: auto` on the
  // scroll node, which then grows to the full content height — so a naive "is it
  // zero" test would cheerfully virtualize against a 56000px viewport and render
  // every row. Read the inline style simplebar sets; it costs no layout.
  const scrollIsAuto = !!scrollElement && scrollElement.style.height === 'auto';

  const measured = viewportHeight > 0 && !scrollIsAuto;

  const everMeasured = React.useRef(false);
  if (measured) everMeasured.current = true;

  let mode: RenderMode = 'flow';
  if (enableVirtualization) {
    if (measured || everMeasured.current) mode = 'virtual';
    else if (viewportWidth <= 0) mode = 'idle';
  }

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!enableVirtualization || mode !== 'flow' || !scrollElement) return;
    console.warn(
      'Chat UI: history list viewport could not be measured, so virtualization is off. '
      + 'This usually means an overridden `historyWrapper` or `historyContainer` slot '
      + 'is not a definite-height flex column.',
    );
  }, [enableVirtualization, mode, scrollElement]);

  useDevHeightCheck(sizerRef, enableVirtualization && mode === 'virtual', itemHeight, groupHeaderHeight);

  // SimpleBar watches its content subtree for childList mutations and calls
  // `recalculate()` — a forced synchronous layout — from a rAF afterwards. That
  // never fired during scrolling before, because the list DOM was static once
  // mounted; with windowing every range change mutates it, so it would fire on
  // roughly every scroll frame. The observer exists to detect horizontal scroll,
  // which this list (nowrap + ellipsis, width 100%) never has, so we drive
  // recalculation ourselves from the only thing that actually changes size.
  React.useEffect(() => {
    if (mode !== 'virtual' || !scrollbar) return;
    scrollbar.mutationObserver?.disconnect();
    scrollbar.mutationObserver = null;
  }, [mode, scrollbar]);

  const virtualizer = useHistoryVirtualizer({
    projection,
    scrollElement,
    sizerElement,
    itemHeight,
    groupHeaderHeight,
    enabled: mode === 'virtual',
  });

  React.useEffect(() => {
    if (mode !== 'virtual') return;
    scrollbar?.recalculate();
  }, [mode, scrollbar, virtualizer.totalSize]);

  const renderItem = (item: ThreadListFlatItem) => {
    if (item.kind === 'header') {
      return (
        <TimeGroupItem
          group={item.group}
          slots={slots}
          slotProps={slotProps}
        />
      );
    }

    const threadType = item.thread.data.type;

    return (
      <ThreadListItem
        icon={threadType && threadTypeIcons ? threadTypeIcons[threadType] : undefined}
        listModel={model.listGroups}
        model={model}
        selected={item.key === currentThreadKey}
        setThread={setThread}
        slots={slots}
        thread={item.thread}
      />
    );
  };

  if (mode === 'idle') return null;

  if (mode === 'flow') {
    // No wrapper elements: this branch must produce exactly the DOM previous
    // releases produced, since it is what every consumer gets by default.
    return (
      <>
        {items.map((item) => (
          <React.Fragment key={item.key}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </>
    );
  }

  const setSizer = (element: HTMLDivElement | null) => {
    sizerRef.current = element;
    setSizerElement(element);
  };

  return (
    <div
      ref={setSizer}
      style={{
        position: 'relative',
        width: '100%',
        flexShrink: 0,
        height: virtualizer.totalSize,
      }}
    >
      {virtualizer.rows.map((row) => {
        const item = items[row.index];
        if (!item) return null;

        const isStickyHeader = item.kind === 'header' && row.index === virtualizer.stickyIndex;

        return (
          <ThreadListRowRoot
            key={row.key}
            ref={isStickyHeader ? virtualizer.stickyRef : undefined}
            style={isStickyHeader ? {
              position: 'sticky',
              top: 0,
              zIndex: 2,
              height: row.size,
            } : {
              position: 'absolute',
              top: 0,
              height: row.size,
              transform: `translateY(${row.start}px)`,
            }}
          >
            {renderItem(item)}
          </ThreadListRowRoot>
        );
      })}
    </div>
  );
};

export default ThreadListBody;
