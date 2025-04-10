import * as React from 'react';
// import TestApp from './test/reasoning/ReasoningStream.tsx';
import TestApp from './views/Sandbox';
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
