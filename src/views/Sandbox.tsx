import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, Message,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Welcome message",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Hello there! How can I assist you today?",
        },
      ],
    },
  ]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        beforeUserMessageSend={(text) => {
          return {
            userMessage: {
              id: 'cravra' + Math.random(),
              role: 'user',
              content: text
            } as Message,
            assistantMessage: {
              id: 'dddddddd' + Math.random(),
              role: 'assistant',
              content: '',
            } as Message,
          };
        }}
        onUserMessageSent={(params) => {
          console.log(params.history);
          onUserMessageSent(params);
        }}
      />
    </Box>
  );
}

export default App;
