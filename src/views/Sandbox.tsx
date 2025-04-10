import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const threadsData: Thread[] = Array(500).fill(0)
  .map((_, i) => (    {
    id: `test-thread-${i}`,
    title: "Welcome message",
    messages: [
      {
        role: "user",
        content: `Hello ${i}`,
      },
      {
        role: "assistant",
        content: "Hello there! How can I assist you today?",
      },
    ],
  }))

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsData);
  const [thread, setThread] = React.useState<Thread | undefined>(threads[0]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        thread={thread}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onChangeCurrentThread={({ thread }) => setThread(thread)}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
