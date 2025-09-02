import * as React from 'react';
import { ChatViewConstants } from '../../../ChatViewConstants';
import { chatClassNames } from '../../../core/chatClassNames';
import { BoxRefType } from '../../../hooks/useElementRef';

type AnimatedElementsType = HTMLSpanElement | HTMLDivElement | HTMLLIElement;

class SmoothManager {
  ran = false;

  readonly id = Math.ceil(Math.random() * 1000);

  private delayValueMs = 30;

  private _firstDelaySet = false;

  // Adding a small delay at the start to allow elements to render correctly
  private firstDelayValueMs = 400;

  constructor(
    private parentRef: BoxRefType,
  ) { }

  check = async () => {
    if (this.ran) return;
    this.ran = true;

    let delayMs = 0;

    // Ищем ближайшего родителя с классом messageAssistantRoot от текущего ref
    const rootEl = this.parentRef.current?.closest(`.${chatClassNames.messageAssistantRoot}`) as HTMLElement | null;
    if (!rootEl) {
      this.ran = false;
      return;
    }

    const elements = (rootEl?.querySelectorAll(`.${chatClassNames.markdownSmoothedPending}`) as NodeListOf<AnimatedElementsType>) ?? [];

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

    delayMs -= this.delayValueMs;

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      setTimeout(() => {
        elements?.forEach((el) => {
          el.classList.remove(chatClassNames.markdownSmoothedAnimating);
          el.style.animationDelay = '0s';
        });
      }, ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS)

    }

    this.ran = false;

    if (delayMs > 0) this.check();
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

export const useSmoothManager = (text: string, inProgress: boolean, parentRef: BoxRefType) => {
  const model = React.useMemo(
    () => inProgress ? new SmoothManager(parentRef) : undefined,
    [inProgress]
  );

  React.useEffect(() => {
    if (inProgress) model?.check();
  }, [text, inProgress]);

}
