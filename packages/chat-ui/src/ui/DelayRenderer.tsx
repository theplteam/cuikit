import * as React from 'react';

type DelayedRendererType = { timeout?: number, fallback?: React.ReactElement; once?: boolean };

export const DelayRenderer: React.FC<React.PropsWithChildren<DelayedRendererType>> = ({ children, timeout, fallback, once }) => {
  const time = timeout || 1;
  const [ready, setReady] = React.useState(false);

  React.useEffect(
    () => {
      if (ready) setReady(false);
      const timeoutId = setTimeout(() => setReady(true), 50 + time);
      return () => { clearTimeout(timeoutId); };
    },
    once ? [] : [children]
  );

  if (!ready) return fallback ?? null;

  return <>{children}</>;
};

export default DelayRenderer;
