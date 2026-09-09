import * as React from 'react';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { ApiManager } from '../core/useApiManager';
import { IdType } from '../../types';
import { ObservableReactValue } from '../../utils/observers/ObservableReactValue';

export type MessageNavJumpOptions = {
  /**
   * Scroll without smooth easing — used while dragging the nav rail.
   */
  immediate?: boolean;
};

export type MessageNavController = {
  userMessages: MessageModel[];
  /**
   * Index of the message the thread is scrolled to. Observable so that scrolling
   * re-renders the rail only, and not the whole thread.
   */
  activeIndex: ObservableReactValue<number>;
  onJump: (index: number, options?: MessageNavJumpOptions) => void;
};

const EMPTY_MESSAGES: MessageModel[] = [];

/**
 * Only the top part of the viewport counts as "active", so the highlighted item is
 * the message you have most recently scrolled to, not any message merely on screen.
 */
const ACTIVE_AREA_ROOT_MARGIN = '0px 0px -60% 0px';

/**
 * How long the observer defers to a jump we started. A smooth scroll passes over
 * intermediate messages, and without this they would overwrite the requested target.
 */
const SMOOTH_SCROLL_SETTLE_MS = 700;

const isEditableTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;

  if (!element || !element.tagName) return false;

  return element.tagName === 'INPUT'
    || element.tagName === 'TEXTAREA'
    || element.isContentEditable;
}

const scrollToElement = (element: HTMLElement | undefined, immediate?: boolean) => {
  element?.scrollIntoView({
    behavior: immediate ? 'auto' : 'smooth',
    block: 'start',
  });
}

export const useMessageNavController = (
  thread: ThreadModel | undefined,
  contentRef: React.RefObject<HTMLDivElement | null> | undefined,
  apiManager: ApiManager,
  enabled: boolean,
): MessageNavController => {
  // Subscribing only when enabled keeps the feature free for consumers that leave it off
  const currentMessages = useObserverValue(enabled ? thread?.messages.currentMessages : undefined, EMPTY_MESSAGES);

  const userMessages = React.useMemo(
    () => (currentMessages ?? EMPTY_MESSAGES).filter((message) => message.isUser),
    [currentMessages],
  );

  const activeIndex = React.useMemo(() => new ObservableReactValue(0), []);

  const settleUntilRef = React.useRef(0);

  const onJump = React.useCallback((index: number, options?: MessageNavJumpOptions) => {
    const message = userMessages[index];

    if (!message || !thread) return;

    settleUntilRef.current = options?.immediate ? 0 : Date.now() + SMOOTH_SCROLL_SETTLE_MS;

    scrollToElement(thread.elements.get(message.id), options?.immediate);
    activeIndex.value = index;
  }, [userMessages, thread, activeIndex]);

  // A new thread starts at its first message rather than inheriting the previous one's position
  React.useEffect(() => {
    activeIndex.value = 0;
  }, [thread]);

  // Switching to a shorter branch must not leave the index pointing past the end
  React.useEffect(() => {
    if (activeIndex.value > userMessages.length - 1) {
      activeIndex.value = Math.max(userMessages.length - 1, 0);
    }
  }, [userMessages]);

  // Track which user message is currently in the active area of the scroller
  React.useEffect(() => {
    if (!enabled || !thread || !userMessages.length) return;

    const indexes = new Map<Element, number>();
    const visible = new Set<Element>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });

      // A jump of ours is still animating — its target outranks the messages it passes
      if (Date.now() < settleUntilRef.current) return;

      let topmost = -1;

      visible.forEach((element) => {
        const index = indexes.get(element);

        if (index !== undefined && (topmost === -1 || index < topmost)) topmost = index;
      });

      // Keep the last known value while nothing is visible — a long assistant answer
      // can fill the whole active area between two user messages.
      if (topmost !== -1) activeIndex.value = topmost;
    }, {
      root: contentRef?.current ?? null,
      rootMargin: ACTIVE_AREA_ROOT_MARGIN,
    });

    userMessages.forEach((message, index) => {
      const element = thread.elements.get(message.id);

      if (element) {
        indexes.set(element, index);
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [enabled, thread, userMessages, contentRef?.current]);

  // Shift + ArrowUp / Shift + ArrowDown jump between user messages
  React.useEffect(() => {
    if (!enabled || !userMessages.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      if (isEditableTarget(event.target) || isEditableTarget(document.activeElement)) return;

      const nextIndex = event.key === 'ArrowUp' ? activeIndex.value - 1 : activeIndex.value + 1;

      if (nextIndex < 0 || nextIndex > userMessages.length - 1) return;

      event.preventDefault();
      onJump(nextIndex);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, userMessages, onJump]);

  React.useEffect(() => {
    apiManager.setMethod('scrollToMessage', (id: IdType) => {
      if (!thread) return;

      scrollToElement(thread.elements.get(id));
    });
  }, [thread]);

  return { userMessages, activeIndex, onJump };
}
