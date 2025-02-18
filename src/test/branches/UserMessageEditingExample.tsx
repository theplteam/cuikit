import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  DDialogue,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const UserMessageEditingExample: React.FC = () => {
  const [dialogues] = React.useState<DDialogue[]>([
    {
      id: "test-dialogue",
      title: "Welcome message",
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
  ]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatPage
        dialogue={dialogues[0]}
        dialogues={dialogues}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        enableBracnhes
      />
    </Box>
  );
}

export default UserMessageEditingExample;
