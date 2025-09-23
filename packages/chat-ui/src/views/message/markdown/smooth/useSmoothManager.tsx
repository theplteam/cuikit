import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';
import { chatClassNames } from '../../../core/chatClassNames';

type AnimatedElementsType = HTMLSpanElement | HTMLDivElement | HTMLLIElement;

class SmoothManager {
  ran = false;

  readonly id = Math.ceil(Math.random() * 1000);

  private delayValueMs = 40;

  private _firstDelaySet = false;

  // Adding a small delay at the start to allow elements to render correctly
  private firstDelayValueMs = 500;

  constructor() { }

  check = async (markdownId: string) => {
    if (this.ran) return;
    this.ran = true;

    let delayMs = 0;

    const messageId = markdownId.split('-').pop();
    const parent = document.getElementById(markdownId);
    const controls = document.getElementById(`message-controls-${messageId}`);

    const elements = (parent?.querySelectorAll(`.${chatClassNames.markdownSmoothedPending}`) as NodeListOf<AnimatedElementsType>) ?? [];

    if (elements.length && !this._firstDelaySet) {
      this._firstDelaySet = true;
      delayMs += this.firstDelayValueMs;
    }

    elements.forEach((el) => {
      // TODO: Sort out the typing
      const hasAnimatedChildren = (el.childNodes.values() as unknown as HTMLDivElement[])
        .some((v) => ['li', 'ol', 'ul'].every(v => v !== el.tagName.toLowerCase())
          && (v.classList?.contains(chatClassNames.markdownSmoothedAnimating) || v.classList?.contains(chatClassNames.markdownSmoothedPending))
        );

      el.classList.remove(chatClassNames.markdownSmoothedPending);

      if (hasAnimatedChildren) {
        /*console.log('has animated children', el, el.tagName);
        console.dir(el);*/
        return;
      }

      el.style.animationDelay = `${delayMs}ms`;

      el.classList.add(chatClassNames.markdownSmoothedAnimating);
      // el.classList.add(`test-class-${key}`);

      delayMs += this.delayValueMs;
    });

    if (controls) {
      controls.classList.remove(chatClassNames.markdownSmoothedPending);
      controls.style.animationDelay = `${delayMs + this.delayValueMs}ms`;
      controls.classList.add(chatClassNames.markdownSmoothedAnimating);
    }
  
    delayMs -= this.delayValueMs;

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      const remove = (el: AnimatedElementsType) => {
        el.classList.remove(chatClassNames.markdownSmoothedAnimating);
        el.style.animationDelay = '0s';
      };
      setTimeout(() => {
        elements?.forEach((el) => remove(el));
        if (controls) remove(controls)
      }, ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS)
    }

    this.ran = false;

    if (delayMs > 0) this.check(markdownId);
  }

  /*checkThrottle = throttle(
    this.check,
    50,
    { leading: true, trailing: true },
  )*/

  getStartTime = (delay: number) => {
    return performance.now() + delay;
  }
}

const smoothManager = new SmoothManager();

export const useSmoothManager = (text: string, inProgress: boolean, markdownId: string) => {
  React.useEffect(() => {
    if (inProgress) smoothManager.check(markdownId);
  }, [text, inProgress]);
};
