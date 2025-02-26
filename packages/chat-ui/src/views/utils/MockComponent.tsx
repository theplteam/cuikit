import React from 'react';

type Props<T> = {} & T;

const MockComponent = <T,>(_props: Props<T>) => null;

const MockRequiredComponent = (componentKey: string) => <T,>(_props: Props<T>) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Required component missing: ${componentKey}`);
    }
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <span>
        {`Required component missing: ${componentKey}`}
      </span>
    )
  }

  return null;
};

export { MockComponent, MockRequiredComponent };
