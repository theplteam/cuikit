import * as React from "react";
import dialoguesJson from '../testDialogues.json';
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import SendIcon from '@mui/icons-material/Send';

const App: React.FC = () => {
  const [dialogues] = React.useState<Thread[]>(dialoguesJson);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatPage
        thread={dialogues[0]}
        threads={dialogues}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        defaultTextFieldValue={'See you later!'}
        slots={{
          sendMessageIcon: SendIcon,
        }}
        slotProps={{
          sendMessageButton: {
            size: 'large',
            sx: {
              color: (theme) => theme.palette.secondary.main,
            },
          },
        }}
      />
    </Box>
  );
}

export default App;
