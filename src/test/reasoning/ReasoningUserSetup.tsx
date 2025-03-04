import * as React from "react";
import {
  ChatPage,
  Thread, useChatApiRef, MessageSentParams, ChatApiRef,
  useAssistantAnswerMock,
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
      title: "Reasoning test",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Hello! Click the \"Send Message\" button to test the reasoning visualization.\n\nHeaders and reasoning time will be set manually.",
        },
      ],
    },
  ]);

  const { reasoningGenerator, streamGenerator } = useAssistantAnswerMock();

  const onUserMessageSent = async ({ reasoning, ...params }: MessageSentParams) => {
    const reasoningStream = reasoningGenerator({ loremIpsum: 'large' });
    const neutralHeadings = [
      "Analysis and Interpretation", "Patterns and Trends", "Context and Meaning", "Logic and Structure",
      "Probability and Outcomes", "Neutral Observations", "Connections and Relations"
    ];

    params.setStatus('Awaiting response...');

    const thinkingTimeStart = performance.now();
    await new Promise(resolve => setTimeout(resolve, 3000));

    reasoning.setViewType('stream');
    let i = 0;
    for await (const reasoningChunk of reasoningStream) {
      if (!(i % 20)) {
        const newTitle = neutralHeadings.shift();
        if (newTitle) reasoning.setTitle(newTitle);
      }
      reasoning.pushChunk(reasoningChunk);
      i++;
    }

    reasoning.setTimeSec((performance.now() - thinkingTimeStart) / 1000);

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }
  }

  const apiRef = useChatApiRef();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableReasoning
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
