import * as React from 'react';

export const useInProgressStateCache = (inProgressProp: boolean) => {
  const [inProgress, setInProgress] = React.useState(false);

  React.useEffect(() => {
    if (!inProgress && inProgressProp) {
      setInProgress(true);
    }
  }, [inProgressProp]);

  return inProgressProp || inProgress;
}
