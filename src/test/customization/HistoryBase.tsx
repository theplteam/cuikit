import * as React from "react";
import threadsJson from '../testThreads.json';
import {
  History,
  Chat,
  useAssistantAnswerMock,
  Thread,
  useChatApiRef,
} from "@plteam/chat-ui";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsJson);
  const chatApiRef = useChatApiRef();

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      height="100dvh"
      width="100dvw"
    >
      <History apiRef={chatApiRef} />
      <Box
        width="100%"
        height='100%'
        overflow="auto"
      >
        <Chat
          apiRef={chatApiRef}
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          onUserMessageSent={onUserMessageSent}
        />
      </Box>
    </Stack>
  );
}

export default App;
