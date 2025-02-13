import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  DMessage,
  DDialogue,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

function App() {
  const [dialogues] = React.useState<DDialogue[]>([
    {
      id: "test-dialogue",
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
      ] as DMessage[],
    },
  ]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100%"}>
      <ChatPage
        dialogue={dialogues[0]}
        dialogues={dialogues}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
