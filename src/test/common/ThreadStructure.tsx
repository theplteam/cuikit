import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Second thread",
      date: (new Date('2025-01-18T12:00:00.000Z')).toISOString(),
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Hello!",
          },
        },
        {
          role: "assistant",
          content: "Hello there! How can I assist you today?",
        },
      ],
    },
    {
      id: "test-thread2",
      title: "First thread",
      date: (new Date('2024-12-12T12:00:00.000Z')).toISOString(),
      messages: [
        {
          role: "user",
          content: "Hello, how are you today?",
        },
        {
          role: "assistant",
          content: "Hi there! I'm doing great, thanks for asking. What can I help you with this morning?",
        },
      ],
    },
  ]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
