import React from 'react';

type Props<T> = {} & T;

const MockComponent = <T,>(props: Props<T>) => null;

const MockRequiredComponent = (componentKey: string) => <T,>(props: Props<T>) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Required component missing: ${componentKey}`);
    }
  }, []);


  if (process.env.NODE_ENV === 'development') {
    return <>Required component missing: {componentKey}</>
  }

  return null;
};

export { MockComponent, MockRequiredComponent };
