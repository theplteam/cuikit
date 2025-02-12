import * as React from 'react';
import dialogues from './test/chatgpt-dialogue-test.json';
import { ChatGptModel, ChatGptDialogueData } from './models/ChatGptModel.ts';
import { ChatGptAdapter, ChatPage } from 'chat-ui';
import Box from '@mui/material/Box';

const helloMessage = 'Hello! I am your AI assistant, and I’m ready to help you with any questions or tasks. Feel free to ask – together we’ll find the best solutions!';

function App() {
  const dd = dialogues as ChatGptDialogueData[];

  const openAi = React.useMemo(() => new ChatGptModel(), []);

  return (
    <Box
      id={"chatRoot"}
      width={'100dvw'}
      height={'100dvh'}
    >
      <ChatGptAdapter>
        <ChatPage
          dialogue={dd[0]}
          dialogues={dd}
          handleStopMessageStreaming={openAi.stopStreaming}
          onUserMessageSent={openAi.streamMessage}
          lang={'ru'}
          helloMessage={helloMessage}
        />
      </ChatGptAdapter>
    </Box>
  )
}

export default App
