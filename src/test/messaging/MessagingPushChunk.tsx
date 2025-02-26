import * as React from "react";
import {
  ChatPage,
  Thread, useChatApiRef, MessageSentParams, useAssistantAnswerMock, ChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';

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
          content: "Hello! Click the \"Send Message\" button to test the `pushChunks` function.",
        },
      ],
    },
  ]);

  const { streamGenerator } = useAssistantAnswerMock()

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    const stream = streamGenerator(undefined, { delay: 100 });

    for await (const chunk of stream) {
      params.pushChunk(chunk ?? '');
    }

    params.onFinish();
  }, []);

  const apiRef = useChatApiRef();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        thread={threads[0]}
        threads={threads}
        apiRef={apiRef}
        slots={{
          messageRowInner: SendMessageRow,
        }}
        slotProps={{
          messageRowInner: { apiRef },
        }}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
