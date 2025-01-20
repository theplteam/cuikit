import * as React from 'react';

export const TestComponent = () => {
  React.useEffect(() => {
    console.log('test lib');
  }, []);

  return <>Hello world</>;
}
