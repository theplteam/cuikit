import * as React from "react";
import threadsJson from '../testThreads.json';
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import SendIcon from '@mui/icons-material/Send';

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsJson);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        defaultTextFieldValue="See you later!"
        slots={{
          sendMessageIcon: SendIcon,
        }}
        slotProps={{
          sendMessageButton: {
            size: 'large',
            sx: {
              color: (theme) => theme.palette.secondary.main,
            },
          },
        }}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
