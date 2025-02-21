import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const [dialogues] = React.useState<Thread[]>([
    {
      id: "test-dialogue",
      title: "Second dialogue",
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
      id: "test-dialogue2",
      title: "First dialogue",
      date: (new Date('2024-12-12T12:00:00.000Z')).toISOString(),
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
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatPage
        thread={dialogues[0]}
        threads={dialogues}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
