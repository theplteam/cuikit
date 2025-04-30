import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, MessageSentParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const startDateTime = (new Date().getTime()) - 300 * 24 * 60 * 60 * 1000;
const timesAdd = 86400 / 2 * 1000;

const threadsData: Thread[] = Array(500).fill(0)
  .map((_, i) => ({
    id: `test-thread-${i}`,
    title: `Welcome message ${i}`,
    date: (new Date(startDateTime + timesAdd*i)).toISOString(),
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

const UserMessageEditingExample: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Welcome message",
      date: (new Date()).toISOString(),
      messages: [
        {
          id: "1",
          role: "user",
          content: "Hello!",
        },
        {
          id: "2",
          parentId: "1",
          role: "assistant",
          content: "Hello there! How can I assist you today?",
        },
        {
          id: "3-1",
          parentId: "2",
          role: "user",
          content: "Explain gravity in simple terms.",
        },
        {
          id: "4-1",
          parentId: "3-1",
          role: "assistant",
          content: "Sure. Gravity is a pull between masses. It makes apples fall. It keeps us on the ground.",
        },
        {
          id: "5-1-1",
          parentId: "4-1",
          role: "user",
          content: "Got it. Can you do a quick math problem? What's 12% of 250?",
        },
        {
          id: "6-1-1",
          parentId: "5-1-1",
          role: "assistant",
          content: "Yes. Multiply 250 by 0.12. The answer is 30.",
        },
        // User message 3-1 has been edited, creating a branch.
        {
          id: "3-2",
          parentId: "2",
          role: "user",
          content: "Let's talk about healthy eating.",
        },
        {
          id: "4-2",
          parentId: "3-2",
          role: "assistant",
          content: "Great choice. What do you need help with?",
        },
        {
          id: "5-2-1",
          parentId: "4-2",
          role: "user",
          content: "I need simple dinner ideas.",
        },
        {
          id: "6-2-1",
          parentId: "5-2-1",
          role: "assistant",
          content: "How about grilled chicken with veggies?",
        },
      ],
    },
    ...threadsData,
  ]);

  const { runStream, handleStopMessageStreaming } =
    useAssistantAnswerMock();

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
        enableBranches
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        lang="ru"
        onUserMessageSent={onSent}
      />
    </Box>
  );
}

export default UserMessageEditingExample;
