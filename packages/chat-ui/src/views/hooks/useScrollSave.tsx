import throttle from "lodash.throttle";
import * as React from 'react';

export const isWindowCheck = <T,>(container: T | Window | null): container is Window => container instanceof Window;

const useScrollSave = (
  model?: {
    scrollY: number,
  },
  options?: {
    getTarget?: () => HTMLElement | null,
    visible: boolean,
  },
) => {
  const container = options?.getTarget ? options.getTarget() : window as Window;
  const isWindow = isWindowCheck(container);
  const visible = options?.visible ?? true;

  const _onScroll = throttle(
    () => {
      if (model && container) {
        if (isWindow) {
          model.scrollY = container.scrollY;
        } else {
          model.scrollY = container.scrollTop;
        }

        // console.log(model.scrollY, 'save');
      }
    }, 100
  );

  const scrollUnsubscribe = () => {
    if (container) {
      container.removeEventListener('scroll', _onScroll);
    }
  };
  const scrollSubscribe = () => {
    if (container) {
      if (model) {
        const scrollY = model.scrollY;
        // console.log(scrollY);
        // TODO: почему-то тут всегда добавляется дополнительно 48px, будто происходит ещё один скролл
        //  не разобрался в причине, вероятно как-то связано с табами, т.к. их высота 48px и они рисуются не сразу
        setTimeout(() => {
          container.scrollTo(0, scrollY);
          container.addEventListener('scroll', _onScroll);
        }, 10)
      }

    }
  };

  React.useEffect(
    () => {
      if (visible) {
        scrollSubscribe();
      } else {
        scrollUnsubscribe();
      }
      return () => { scrollUnsubscribe(); };
    },
    [visible]
  );

  return {
    scrollUnsubscribe,
    scrollSubscribe,
  }
}

export default useScrollSave;
