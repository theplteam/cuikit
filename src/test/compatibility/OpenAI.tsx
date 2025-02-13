import * as React from "react";
import dialogues from "./chatgpt-dialogue-test.json";
import {
  ChatGptAdapter,
  ChatPage,
  useAssistantAnswerMock,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const helloMessage =
  "Hello! I am your AI assistant, and I’m ready to help you with any questions or tasks. Feel free to ask – together we’ll find the best solutions!";

const App: React.FC = () => {
  const dd = dialogues as any;

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatGptAdapter>
        <ChatPage
          dialogue={dd[0]}
          dialogues={dd}
          handleStopMessageStreaming={handleStopMessageStreaming}
          onUserMessageSent={onUserMessageSent}
          helloMessage={helloMessage}
          listPlacement={'right'}
        />
      </ChatGptAdapter>
    </Box>
  );
}

export default App;
