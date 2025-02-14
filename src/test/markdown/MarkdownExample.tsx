import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  DDialogue,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import dialoguesJson from './dialogues-markdown-test.json';

const App: React.FC = () => {
  const [dialogues] = React.useState<DDialogue[]>(dialoguesJson);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
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
