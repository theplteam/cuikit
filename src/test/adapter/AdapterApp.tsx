import * as React from "react";
import {
  ChatPage,
  MessageSentParams,
  useAssistantAnswerMock,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Adapter from "./Adapter";

type AdapterThread = {
  id: string;
  title: string;
  messages: AdapterMessage[];
}

export type AdapterMessage = {
  id: string;
  owner: 'user' | 'assistant';
  text: string;
}

const AdapterApp: React.FC = () => {

  const [threads] = React.useState<AdapterThread[]>([
    {
      id: "test-thread",
      title: "Adapter test",
      messages: [
        {
          id: "test-message-1",
          owner: "user",
          text: "Hello!",
        },
        {
          id: "test-message-2",
          owner: "assistant",
          text: "Hello! Click the \"Send Message\" button to test the reasoning visualization.\n\nHeaders and reasoning time will be set manually.",
        },
      ],
    },
  ]);

  const { streamGenerator } = useAssistantAnswerMock();

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }

    const { userMessage, assistantMessage } = params.onFinish();

    console.log('output message format >>>');
    console.log(userMessage, assistantMessage);
  }, []);

  return (
    <Box height="100dvh" width="100dvw">
      <Adapter>
        <ChatPage
          enableReasoning
          thread={threads[0]}
          threads={threads}
          onUserMessageSent={onUserMessageSent}
        />
      </Adapter>
    </Box>
  );
}

export default AdapterApp;
