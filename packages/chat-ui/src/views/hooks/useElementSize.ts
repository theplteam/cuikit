import * as React from 'react';

export type ElementSize = {
  width: number;
  height: number;
};

const EMPTY_SIZE: ElementSize = { width: 0, height: 0 };

/**
 * Observes a DOM element held in state (not behind a ref callback) and reports
 * its border-box size.
 *
 * Unlike `useThrottledResizeObserver` this is deliberately un-throttled: the
 * history list uses the first non-zero measurement to decide whether it can
 * virtualize at all, and delaying that decision makes the list flicker through
 * a non-virtual render on every mount.
 *
 * Pass `enabled: false` to skip observing entirely — consumers that never
 * virtualize should not pay for a ResizeObserver.
 */
export const useElementSize = (element: HTMLElement | null, enabled = true): ElementSize => {
  const [size, setSize] = React.useState<ElementSize>(EMPTY_SIZE);

  React.useLayoutEffect(() => {
    if (!enabled || !element) {
      setSize(EMPTY_SIZE);
      return;
    }

    const read = () => {
      setSize((current) => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (current.width === width && current.height === height) return current;
        return { width, height };
      });
    };

    read();

    const observer = new ResizeObserver(read);
    observer.observe(element);

    return () => observer.disconnect();
  }, [element, enabled]);

  return size;
};

export default useElementSize;
