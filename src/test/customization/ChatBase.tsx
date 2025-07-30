import * as React from "react";
import threadsJson from '../testThreads.json';
import {
  Chat,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsJson);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box
      height="100dvh"
      width="100dvw"
    >
      <Chat
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
