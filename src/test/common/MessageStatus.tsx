import * as React from "react";
import {
  ChatPage,
  Thread, MessageSentParams,
  useChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const awaitSeconds = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const App: React.FC = () => {
  const apiRef = useChatApiRef();
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Message status",
      messages: [
        {
          id: '1',
          role: "user",
          content: "Hello!",
        },
        {
          id: '2',
          role: "assistant",
          content: "",
          initialStatus: 'Please wait a little longer.',
        },
      ],
    },
  ]);

  const onUserMessageSent = async (params: MessageSentParams) => {
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
    await awaitSeconds(1);
    params.onFinish();
  };

  const awaitedResponse = async () => {
    if (!apiRef.current) return;
    await awaitSeconds(2);
    apiRef.current?.setMessageStatus('Done', true);
    await awaitSeconds(1);
    apiRef.current?.setMessageText('This was an example of waiting statuses for the assistant\'s response.');
    await awaitSeconds(1);
    apiRef.current?.setMessageStatus('finish');
  };

  React.useEffect(() => {
    awaitedResponse();
  }, [apiRef.current]);

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        apiRef={apiRef}
        initialThread={threads[0]}
        threads={threads}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
