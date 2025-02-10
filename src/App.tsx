import './App.css'
import * as React from 'react';
import dialogues from './test/dialogues.json';
import { useCustomAssistantActions } from './views/customAssistantActions';
import ChatUi from '../packages/chat-ui/src/views/chatUi/ChatUi';
import Root from './test/Root';
import { ChatGptModel, ChatGptDialogueData } from './models/ChatGptModel.ts';

function App() {
  const dd = dialogues as ChatGptDialogueData[];

  const openAi = React.useMemo(() => new ChatGptModel(), []);

  const customActions = useCustomAssistantActions();

  return (
    <Root>
      <ChatUi
        dialogues={dd}
        handleStopMessageStreaming={openAi.stopStreaming}
        onUserMessageSent={openAi.streamMessage}
        assistantActions={customActions}
        userId={20}
        lang={'ru'}
      />
    </Root>
  )
}

export default App
