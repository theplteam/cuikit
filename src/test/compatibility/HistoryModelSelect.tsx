import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  AIModelType,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const aiModelList: AIModelType[] = [{
  model: 'auto',
  label: 'Auto',
},
{
  model: '2.5_flash',
  label: '2.5 Flash',
  description: "Fast all-around help"
},
{
  model: '2.5_pro',
  label: '2.5 Pro',
  description: "Reasoning, math & code"
}];

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Welcome message",
      aiModel: aiModelList[0].model,
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

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        historyProps={{
          aiModelList,
        }}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
