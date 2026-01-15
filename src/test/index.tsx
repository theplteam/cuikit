import * as React from 'react';
const AwaitingResponse = React.lazy(() => import('./common/AwaitingResponse'));
const UserMessageEditingExample = React.lazy(() => import('./branches/UserMessageEditingExample'));
const MarkdownExample = React.lazy(() => import('./markdown/MarkdownExample'));
const MarkdownCustomExample = React.lazy(() => import('./markdown/MarkdownCustomExample'));
const MarkdownCustomComponents = React.lazy(() => import('./markdown/MarkdownCustomComponents'));
const MarkdownRtlText = React.lazy(() => import('./markdown/MarkdownRtlText'));
const CustomSlots = React.lazy(() => import('./customization/CustomSlots'));
const BaseExample = React.lazy(() => import('./common/BaseExample'));
const ThreadStructure = React.lazy(() => import('./common/ThreadStructure'));
const OpenAI = React.lazy(() => import('./compatibility/OpenAI'));
const CustomAssistantActions = React.lazy(() => import('./customization/CustomAssistantActions'));
const ApiRefTest = React.lazy(() => import('./common/ApiRefTest'));
const ThreadInteraction = React.lazy(() => import('./common/ThreadInteraction'));
const CustomScrollContainer = React.lazy(() => import('./customization/CustomScrollContainer'));
const CustomHistoryPosition = React.lazy(() => import('./customization/CustomHistoryPosition'));
const MessagingPushChunk = React.lazy(() => import('./messaging/MessagingPushChunk'));
const MessagingPushAll = React.lazy(() => import('./messaging/MessagingPushAll'));
const MessagingFinishing = React.lazy(() => import('./messaging/MessagingFinishing'));
const ReasoningWithHeadings = React.lazy(() => import('./reasoning/ReasoningWithHeadings'));
const ReasoningStream = React.lazy(() => import('./reasoning/ReasoningStream'));
const ReasoningHistory = React.lazy(() => import('./reasoning/ReasoningHistory'));
const ReasoningUserSetup = React.lazy(() => import('./reasoning/ReasoningUserSetup'));
const FileAttachmentBase = React.lazy(() => import('./fileAttachment/FileAttachmentBase'));
const FileAttachmentError = React.lazy(() => import('./fileAttachment/FileAttachmentError'));
const FileAttachmentProgress = React.lazy(() => import('./fileAttachment/FileAttachmentProgress'));
const FileAttachmentRestrictions = React.lazy(() => import('./fileAttachment/FileAttachmentRestrictions'));
const ExternalSnackbar = React.lazy(() => import('./snackbar/ExternalSnackbar'));
const ThreadActions = React.lazy(() => import('./common/ThreadActions'));
const ToolsBase = React.lazy(() => import('./tools/ToolsBase'));
const ModelSelect = React.lazy(() => import('./compatibility/ModelSelect'));
const ThemeSwitch = React.lazy(() => import('./customization/ThemeSwitch'));

const App: React.FC = () => {
  const [component, setComponent] = React.useState<any>(null);

  React.useEffect(() => {
    const querystring = window.location.search;
    const params = new URLSearchParams(querystring);
    const componentName = params.get('variant');

    // npx eslint --fix
    let variant: React.JSXElementConstructor<any> | null = null;
    switch (componentName) {
      case 'select-ai-model': variant = ModelSelect; break;
      case 'theme': variant = ThemeSwitch; break;
      case 'message-editing': variant = UserMessageEditingExample; break;
      case 'markdown-example': variant = MarkdownExample; break;
      case 'markdown-custom': variant = MarkdownCustomExample; break;
      case 'markdown-custom-components': variant = MarkdownCustomComponents; break;
      case 'markdown-rtl': variant = MarkdownRtlText; break;
      case 'custom-slots': variant = CustomSlots; break;
      case 'common': variant = BaseExample; break;
      case 'openai-adapter': variant = OpenAI; break;
      case 'awaiting-response': variant = AwaitingResponse; break;
      case 'thread-structure': variant = ThreadStructure; break;
      case 'assistant-actions': variant = CustomAssistantActions; break;
      case 'api-reference': variant = ApiRefTest; break;
      case 'custom-history-position': variant = CustomHistoryPosition; break;
      case 'thread-interaction': variant = ThreadInteraction; break;
      case 'thread-actions': variant = ThreadActions; break;
      case 'message-push-chunk': variant = MessagingPushChunk; break;
      case 'message-push-all': variant = MessagingPushAll; break;
      case 'message-finishing': variant = MessagingFinishing; break;
      case 'custom-scroll-container': variant = CustomScrollContainer; break;
      case 'reasoning-with-headings': variant = ReasoningWithHeadings; break;
      case 'reasoning-stream': variant = ReasoningStream; break;
      case 'reasoning-history': variant = ReasoningHistory; break;
      case 'reasoning-user-setup': variant = ReasoningUserSetup; break;
      case 'message-attachment': variant = FileAttachmentBase; break;
      case 'message-attachment-error': variant = FileAttachmentError; break;
      case 'message-attachment-progress': variant = FileAttachmentProgress; break;
      case 'message-attachment-restrictions': variant = FileAttachmentRestrictions; break;
      case 'snackbar': variant = ExternalSnackbar; break;
      case 'thread-actions': variant = ThreadActions; break;
      case 'tools': variant = ToolsBase; break;
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
