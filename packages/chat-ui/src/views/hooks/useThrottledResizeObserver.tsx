import React from "react";
import useResizeObserver, { ObservedSize, ResizeObserverBoxOptions, RoundingFunction } from "use-resize-observer";
import throttle from 'lodash.throttle';

type Options = {
  box?: ResizeObserverBoxOptions;
  round?: RoundingFunction;
};

export default (waitMs: number, options?: Options) => {
  const [size, setSize] = React.useState<ObservedSize | undefined>();
  const [lastSize, setLastSize] = React.useState<ObservedSize | undefined>();

  const onResize = React.useMemo(() => throttle((newSize: ObservedSize) => {
    if (newSize?.width && newSize?.height) setLastSize(newSize);
    setSize(newSize);
  }, waitMs), [waitMs]);
  const { ref } = useResizeObserver({ onResize, ...options });

  React.useEffect(() => {}, [size]);

  return { ref, ...size, lastSize };
};
