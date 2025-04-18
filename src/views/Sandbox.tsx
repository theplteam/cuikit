import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, MessageSentParams, useChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const threadsData: Thread[] = Array(50).fill(0)
  .map((_, i) => ({
    id: `test-thread-${i}`,
    title: "Welcome message",
    messages: [
      {
        role: "user",
        content: `Hello ${i}`,
      },
      {
        role: "assistant",
        content: "Hello there! How can I assist you today?\n\n----\n\nDivider under me",
      },
    ],
  }))

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsData);
  const [thread, setThread] = React.useState<Thread | undefined>();
  const [loading, setLoading] = React.useState(true);

  const apiRef = useChatApiRef();

  const { runStream, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  React.useEffect(() => {
    setTimeout(() => {
      setThread(threads[0]);
      setLoading(false);
    }, 100);
  });

  React.useEffect(() => {
    console.log(thread?.id, apiRef.current?.getCurrentThread()?.id)
    if (thread && apiRef.current?.getCurrentThread()?.id !== thread.id) {
      apiRef.current?.onChangeThread(thread.id);
    }
  }, [thread?.id]);

  const onSent = async (params: MessageSentParams) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    await runStream(params.pushChunk, { loremIpsumSize: 'small' });

    //await new Promise(resolve => setTimeout(resolve, 500));
    params.actions.updateCurrentTextIndex();
    params.setStatus('Searching');

    await new Promise(resolve => setTimeout(resolve, 3000));

    params.setStatus('Analyzing');

    await new Promise(resolve => setTimeout(resolve, 3000));

    await runStream(params.pushChunk, { loremIpsumSize: 'medium' });

    params.onFinish();
  }

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableReasoning
        apiRef={apiRef}
        threads={threads}
        loading={loading}
        defaultTextFieldValue="Text"
        handleStopMessageStreaming={handleStopMessageStreaming}
        onChangeCurrentThread={({ thread }) => setThread(thread)}
        onUserMessageSent={onSent}
      />
    </Box>
  );
}

export default App;
