import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';
import { chatClassNames } from '../../../core/chatClassNames';

type AnimatedElementsType = HTMLSpanElement | HTMLDivElement | HTMLLIElement;

class SmoothManager {
  // Scans are coalesced so a burst of chunks in one tick costs a single DOM query, but they
  // stay independent of how long a fade lasts: the two used to share one lock, so a large
  // `typingSpeed` also made newly arrived text wait that long before it was even looked at.
  //
  // Deliberately a timer and not requestAnimationFrame — rAF does not run at all while the
  // tab is hidden, which would leave a whole streamed message stuck at opacity 0 for anyone
  // who switches tabs mid-answer. Background timers are throttled but still fire.
  private scanScheduled = false;

  private animatedElements = new WeakSet<AnimatedElementsType>();

  check = (typingSpeed: number, staggerStep: number) => {
    if (this.scanScheduled) return;
    this.scanScheduled = true;

    setTimeout(() => {
      this.scanScheduled = false;
      this.scan(typingSpeed, staggerStep);
    }, 0);
  };

  private scan = (typingSpeed: number, staggerStep: number) => {
    const allMarkdownElements = document.getElementsByClassName(chatClassNames.messageAssistantRoot);
    const parent = allMarkdownElements.item(allMarkdownElements.length - 1);
    const pending = Array.from(
      (parent?.querySelectorAll(`.${chatClassNames.markdownSmoothedPending}`) as NodeListOf<AnimatedElementsType>) ?? []
    );

    const batch = pending.filter(el => !this.animatedElements.has(el));

    if (batch.length === 0) return;

    const batchSet = new Set(batch);

    const toAnimate: AnimatedElementsType[] = [];
    const toSkip: AnimatedElementsType[] = [];

    batch.forEach(el => {
      const isListEl = ['li', 'ol', 'ul'].some(tag => tag === el.tagName.toLowerCase());
      const hasChildInBatch = !isListEl && Array.from(el.childNodes as NodeListOf<AnimatedElementsType>)
        .some(child => batchSet.has(child));
      (hasChildInBatch ? toSkip : toAnimate).push(el);
    });

    // Mark the whole batch immediately: overlapping scans must never pick these up again,
    // and React re-applies the pending class on later renders.
    batch.forEach(el => this.animatedElements.add(el));

    // Parent containers that have children animating: make visible without a separate animation.
    toSkip.forEach(el => {
      el.classList.remove(chatClassNames.markdownSmoothedPending);
      el.style.opacity = '1';
    });

    if (toAnimate.length === 0) return;

    // How long the whole batch takes to come in. It is the natural span at the requested step,
    // bounded relative to the fade so a big batch never crawls in over a long wave.
    const maxDelay = Math.min(
      (toAnimate.length - 1) * staggerStep,
      typingSpeed * ChatViewConstants.TEXT_SMOOTH_STAGGER_MAX_FRACTION,
    );

    // New leaf/block elements: fade in sequentially. `querySelectorAll` returns document order,
    // so the stagger always runs top-to-bottom. The delay is spread evenly across the whole
    // span rather than stepping until a ceiling and pinning everything after it to that value —
    // that used to stagger only the first few elements and start the rest as one jump.
    toAnimate.forEach((el, i) => {
      const delay = toAnimate.length > 1 ? (i / (toAnimate.length - 1)) * maxDelay : 0;

      el.classList.remove(chatClassNames.markdownSmoothedPending);
      el.classList.add(chatClassNames.markdownSmoothedAnimating);
      el.style.animationDelay = `${Math.round(delay)}ms`;
    });

    // Each batch cleans up on its own timer instead of the scan awaiting it. A fade that is
    // still running therefore never holds back the next batch — fades overlap, and text keeps
    // entering at the rate it arrives whatever `typingSpeed` is set to.
    setTimeout(() => {
      toAnimate.forEach(el => {
        el.classList.remove(chatClassNames.markdownSmoothedAnimating);
        el.style.animationDelay = '0s';
        // Override the pending class's opacity:0 so the element stays visible
        // when React re-applies the pending class on the next render cycle.
        el.style.opacity = '1';
      });

      // Late sweep for elements that appeared without a text change (e.g. the action buttons
      // mounting after the last chunk). Discovery no longer depends on this — scan() returns
      // immediately when there is nothing new, so the chain ends on its own.
      this.check(typingSpeed, staggerStep);
    }, maxDelay + typingSpeed);
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
