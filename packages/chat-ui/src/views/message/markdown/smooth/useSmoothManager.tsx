import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';
import throttle from 'lodash.throttle';
import { chatClassNames } from '../../../core/chatClassNames';

type AnimatedElementsType = HTMLSpanElement | HTMLDivElement | HTMLLIElement;

class SmoothManager {
  ran = false;

  private delayValueMs = 40;

  private _firstDelaySet = false;

  // Adding a small delay at the start to allow elements to render correctly
  private firstDelayValueMs = 500;

  constructor() {}

  private check = async () => {
    if (this.ran) return;
    this.ran = true;

    let delayMs = 0;
    const allMarkdownElements = document.getElementsByClassName(chatClassNames.messageAssistantRoot);

    const parent = allMarkdownElements.item(allMarkdownElements.length - 1);

    const elements = (parent?.querySelectorAll(`.${chatClassNames.markdownSmoothedPending}`) as NodeListOf<AnimatedElementsType>) ?? [];

    if (elements.length && !this._firstDelaySet) {
      this._firstDelaySet = true;
      delayMs += this.firstDelayValueMs;
    }

    elements.forEach((el) => {
      const hasAnimatedChildren = (el.childNodes.values() as ArrayIterator<HTMLDivElement>)
        .some((v) => v.classList?.contains(chatClassNames.markdownSmoothedAnimating) || v.classList?.contains(chatClassNames.markdownSmoothedPending));

      el.classList.remove(chatClassNames.markdownSmoothedPending);

      if (hasAnimatedChildren) return;

      el.style.animationDelay = `${delayMs}ms`;

      el.classList.add(chatClassNames.markdownSmoothedAnimating);
      // el.classList.add(`test-class-${key}`);
      delayMs += this.delayValueMs;
    });

    delayMs -= this.delayValueMs;

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      setTimeout(() => {
        elements?.forEach((el) => {
          el.classList.remove(chatClassNames.markdownSmoothedAnimating);
          el.style.animationDelay = '0s';
        });
      }, ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS);
    }

    this.ran = false;

    if (delayMs > 0) this.checkThrottle();
  }

  checkThrottle = throttle(
    this.check,
    50,
    { leading: true, trailing: true },
  )
}

export const useSmoothManager = (text: string, inProgress: boolean) => {
  const model = React.useMemo(
    () => inProgress ? new SmoothManager() : undefined,
    [inProgress]
  );

  React.useEffect(() => {
    if (inProgress) model?.checkThrottle();
  }, [text, inProgress]);

}
