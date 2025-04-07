import * as React from 'react';
import TestApp from './test/reasoning/ReasoningUserSetup';
import eruda from 'eruda';

const App: React.FC = () => {
  React.useEffect(() => {
    eruda.init();
  }, [])
  return (
    <TestApp />
  )
}

export default App
