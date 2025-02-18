import * as React from 'react';
const UserMessageEditingExample = React.lazy(() => import('./branches/UserMessageEditingExample'));
const MarkdownPreview = React.lazy(() => import('./markdown/App'));
const CustomSlots = React.lazy(() => import('./customization/CustomSlots'));
const BaseExample = React.lazy(() => import('./common/BaseExample'));
const OpenAI = React.lazy(() => import('./compatibility/OpenAI'));

const App: React.FC = () => {
  const [component, setComponent] = React.useState<any>(null);

  React.useEffect(() => {
    const querystring = window.location.search;
    const params = new URLSearchParams(querystring);
    const componentName = params.get('variant');

    let variant: React.JSXElementConstructor<any> | null = null;
    switch (componentName) {
      case 'message-editing': variant = UserMessageEditingExample; break;
      case 'markdown': variant = MarkdownPreview; break;
      case 'custom-slots': variant = CustomSlots; break;
      case 'common': variant = BaseExample; break;
      case 'openai-adapter': variant = OpenAI; break;
    }

    setComponent(variant);
  }, []);

  if (component) {
    return React.createElement(component);
  }

  return null;
}

export default App
