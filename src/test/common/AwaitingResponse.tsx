import * as React from "react";
import {
  ChatPage,
  Thread, MessageSentParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const awaitSeconds = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

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

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    await awaitSeconds(2);
    params.setStatus('We\'ve been waiting for 2 seconds already.');
    await awaitSeconds(3);
    params.setStatus('And another 3 seconds.');
    await awaitSeconds(3);
    params.setStatus('We\'re almost finished.');
    await awaitSeconds(3);
    params.setStatus('Done');
    await awaitSeconds(1);

    params.setText('This was an example of waiting statuses for the assistant\'s response.');
    params.onFinish();
  }, []);

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        defaultTextFieldValue="Test" thread={threads[0]} threads={threads}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
