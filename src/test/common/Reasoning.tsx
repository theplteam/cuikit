import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, MessageSentParams, useChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

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

  const apiRef = useChatApiRef();

  const { streamGenerator, handleStopMessageStreaming, reasoningGenerator } =
    useAssistantAnswerMock();

  const onUserMessageSent = async (params: MessageSentParams) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const reasoningStream = reasoningGenerator();

    for await (const reasoningChunk of reasoningStream) {
      params.pushReasoningChunk(reasoningChunk);
    }

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }
  }

  React.useEffect(() => {
    (new Promise(resolve => setTimeout(resolve, 1000)))
      .then(() => {
        apiRef.current?.sendUserMessage('test');
      });
  }, []);

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        defaultTextFieldValue="test"
        apiRef={apiRef}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
