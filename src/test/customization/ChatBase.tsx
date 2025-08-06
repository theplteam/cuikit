import * as React from "react";
import {
  Chat,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const threads: Thread[] = [{
    id: "1",
    title: "Chat Base",
    messages: [
      {
        id: "1",
        content: "Hi! Do you know anything about traveling to Japan?",
        role: "user",
      },
      {
        id: "2",
        content: "Hi! Yes, I know a bit. What specifically do you want to know? Transportation, culture, or something else?",
        role: "assistant",
      },
      {
        id: "3",
        content: "I'm curious about transportation. How does the train system work?",
        role: "user",
      },
      {
        id: "4",
        content: "Japan has an excellent train system. There are high-speed trains called Shinkansen connecting major cities, and regional lines are great for shorter trips.",
        role: "assistant",
      },
    ],
    date: "2024-11-16 08:07:54"
  }];

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
