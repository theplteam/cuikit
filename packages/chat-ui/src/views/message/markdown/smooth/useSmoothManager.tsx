import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';
import { chatClassNames } from '../../../core/chatClassNames';

type AnimatedElementsType = HTMLSpanElement | HTMLDivElement | HTMLLIElement;

class SmoothManager {
  ran = false;

  private animatedElements = new WeakSet<AnimatedElementsType>();

  // Delay between elements so a batch fades in as a top-to-bottom wave instead of all at once.
  private delayStepMs = 40;

  check = async (typingSpeed: number) => {
    if (this.ran) return;
    this.ran = true;

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
    // order, so the stagger always runs top-to-bottom.
    toAnimate.forEach((el, i) => {
      el.classList.remove(chatClassNames.markdownSmoothedPending);
      el.classList.add(chatClassNames.markdownSmoothedAnimating);
      el.style.animationDelay = `${i * this.delayStepMs}ms`;
    });

    if (toAnimate.length > 0) {
      // Wait until the last element's delayed animation has finished before cleanup.
      const totalMs = (toAnimate.length - 1) * this.delayStepMs + typingSpeed;
      await new Promise<void>((resolve) => setTimeout(resolve, totalMs));

      toAnimate.forEach(el => {
        el.classList.remove(chatClassNames.markdownSmoothedAnimating);
        el.style.animationDelay = '0s';
        // Override the pending class's opacity:0 so the element stays visible
        // when React re-applies the pending class on the next render cycle.
        el.style.opacity = '1';
      });
    }

    this.ran = false;

    if (batch.length > 0) this.check(typingSpeed);
  };
}

const smoothManager = new SmoothManager();

export const useSmoothManager = (text: string, inProgress: boolean, typingSpeed?: number) => {
  React.useEffect(() => {
    if (inProgress) smoothManager.check(typingSpeed || ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS);
  }, [text, inProgress]);
};
