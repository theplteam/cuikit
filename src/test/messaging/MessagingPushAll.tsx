import * as React from "react";
import {
  ChatPage,
  Thread, useChatApiRef, MessageSentParams, ChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { generateRandomLoremIpsum } from '../../../packages/chat-ui/src/utils/stringUtils/generateLoremIpsum.ts';

const SendMessageRow: React.FC<{ apiRef: React.RefObject<ChatApiRef> }> = ({ apiRef }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await apiRef.current?.sendUserMessage('Run test');
    setIsLoading(false);
  };
  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Button
        disabled={isLoading}
        variant="contained"
        sx={{ width: "min(70%, 300px)" }}
        onClick={onClick}
      >
        {"Send test Message\r"}
      </Button>
    </Box>
  );
}

const App: React.FC = () => {

  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Messaging test",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Hello! Click the \"Send Message\" button to test the `setText` function.\n\nThe message will appear in full after a short pause that simulates receiving a response from the server.",
        },
      ],
    },
  ]);

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const testText = generateRandomLoremIpsum('medium');

    params.setText(testText);

    params.onFinish();
  }, []);

  const apiRef = useChatApiRef();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        initialThread={threads[0]}
        threads={threads}
        apiRef={apiRef}
        slots={{
          threadInput: SendMessageRow,
        }}
        slotProps={{
          threadInput: { apiRef },
        }}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
