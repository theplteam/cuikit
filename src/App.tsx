import './App.css'
import * as React from 'react';
import dialogues from './test/chatgpt-dialogue-test.json';
import { useCustomAssistantActions } from './views/customAssistantActions';
import ChatUi from '../packages/chat-ui/src/views/chatUi/ChatUi';
import Root from './test/Root';
import { ChatGptModel, ChatGptDialogueData } from './models/ChatGptModel.ts';
import ChatLicenseInfo from '../packages/chat-ui/src/views/license/ChatLicenseInfo.ts';
import ChatGptAdapter from '../packages/chat-ui/src/views/adapter/ChatGptAdapter.tsx';

ChatLicenseInfo.setLicenseKey(import.meta.env.VITE_CHAT_UI_LICENSE_KEY);

function App() {
  const dd = dialogues as ChatGptDialogueData[];

  const openAi = React.useMemo(() => new ChatGptModel(), []);

  const customActions = useCustomAssistantActions();

  return (
    <Root>
      <ChatGptAdapter>
        <ChatUi
          dialogues={dd}
          handleStopMessageStreaming={openAi.stopStreaming}
          onUserMessageSent={openAi.streamMessage}
          assistantActions={customActions}
          userId={20}
          lang={'ru'}
        />
      </ChatGptAdapter>
    </Root>
  )
}

export default App
