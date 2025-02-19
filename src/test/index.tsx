import * as React from 'react';
const AwaitingResponse = React.lazy(() => import('./common/AwaitingResponse'));
const UserMessageEditingExample = React.lazy(() => import('./branches/UserMessageEditingExample'));
const MarkdownPreview = React.lazy(() => import('./markdown/App'));
const CustomSlots = React.lazy(() => import('./customization/CustomSlots'));
const BaseExample = React.lazy(() => import('./common/BaseExample'));
const DialogueStructure = React.lazy(() => import('./common/DialogueStructure'));
const OpenAI = React.lazy(() => import('./compatibility/OpenAI'));
const CustomAssistantActions = React.lazy(() => import('./customization/CustomAssistantActions'));

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
      case 'awaiting-response': variant = AwaitingResponse; break;
      case 'dialogue-structure': variant = DialogueStructure; break;
      case 'assistant-actions': variant = CustomAssistantActions; break;
    }

    // console.log(`componentName: ${componentName}`, !!variant);

    setComponent(variant);
  }, []);

  if (component) {
    return React.createElement(component);
  }

  return null;
}

export default App
