import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';
import { chatClassNames } from '../../../core/chatClassNames';

type AnimatedElementsType = HTMLSpanElement | HTMLDivElement | HTMLLIElement;

class SmoothManager {
  private running = false;

  // Set when check() is called while a run is in flight (e.g. the action buttons just
  // mounted). Ensures the request is honored after the current run instead of being
  // silently dropped.
  private rerunRequested = false;

  private animatedElements = new WeakSet<AnimatedElementsType>();

  check = async (typingSpeed: number, staggerStep: number) => {
    if (this.running) {
      this.rerunRequested = true;
      return;
    }
    this.running = true;

    const allMarkdownElements = document.getElementsByClassName(chatClassNames.messageAssistantRoot);
    const parent = allMarkdownElements.item(allMarkdownElements.length - 1);
    const pending = Array.from(
      (parent?.querySelectorAll(`.${chatClassNames.markdownSmoothedPending}`) as NodeListOf<AnimatedElementsType>) ?? []
    );

    const batch = pending.filter(el => !this.animatedElements.has(el));
    const batchSet = new Set(batch);

    const toAnimate: AnimatedElementsType[] = [];
    const toSkip: AnimatedElementsType[] = [];

    batch.forEach(el => {
      const isListEl = ['li', 'ol', 'ul'].some(tag => tag === el.tagName.toLowerCase());
      const hasChildInBatch = !isListEl && Array.from(el.childNodes as NodeListOf<AnimatedElementsType>)
        .some(child => batchSet.has(child));
      (hasChildInBatch ? toSkip : toAnimate).push(el);
    });

    // Mark the whole batch immediately to prevent reprocessing in the recursive call.
    batch.forEach(el => this.animatedElements.add(el));

    // Parent containers that have children animating: make visible without a separate animation.
    toSkip.forEach(el => {
      el.classList.remove(chatClassNames.markdownSmoothedPending);
      el.style.opacity = '1';
    });

    // New leaf/block elements: fade in sequentially. `querySelectorAll` returns document
    // order, so the stagger always runs top-to-bottom. The cumulative delay is capped so a
    // big batch starts almost simultaneously instead of crawling in a long wave.
    toAnimate.forEach((el, i) => {
      el.classList.remove(chatClassNames.markdownSmoothedPending);
      el.classList.add(chatClassNames.markdownSmoothedAnimating);
      el.style.animationDelay = `${Math.min(i * staggerStep, ChatViewConstants.TEXT_SMOOTH_STAGGER_MAX_MS)}ms`;
    });

    if (toAnimate.length > 0) {
      // Wait until the last (capped) delayed animation has finished before cleanup.
      const maxDelay = Math.min((toAnimate.length - 1) * staggerStep, ChatViewConstants.TEXT_SMOOTH_STAGGER_MAX_MS);
      const totalMs = maxDelay + typingSpeed;
      await new Promise<void>((resolve) => setTimeout(resolve, totalMs));

      toAnimate.forEach(el => {
        el.classList.remove(chatClassNames.markdownSmoothedAnimating);
        el.style.animationDelay = '0s';
        // Override the pending class's opacity:0 so the element stays visible
        // when React re-applies the pending class on the next render cycle.
        el.style.opacity = '1';
      });
    }

    this.running = false;

    // Re-scan if new pending elements appeared during this run, or another check() was
    // requested while we were busy (e.g. the action buttons mounted after the last chunk).
    if (batch.length > 0 || this.rerunRequested) {
      this.rerunRequested = false;
      this.check(typingSpeed, staggerStep);
    }
  };
}

const smoothManager = new SmoothManager();

// Imperative entry point for elements that mount outside the streaming text flow (the
// message action buttons + footer), which otherwise never trigger a check().
export const triggerSmoothCheck = (typingSpeed?: number, staggerStep?: number) => {
  smoothManager.check(
    typingSpeed || ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS,
    staggerStep ?? ChatViewConstants.TEXT_SMOOTH_STAGGER_STEP_MS,
  );
};

export const useSmoothManager = (text: string, inProgress: boolean, typingSpeed?: number, staggerStep?: number) => {
  React.useEffect(() => {
    if (inProgress) triggerSmoothCheck(typingSpeed, staggerStep);
  }, [text, inProgress]);
};
