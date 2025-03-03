import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, MessageSentParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const reasoningText = `
**Logical Analysis**  

The phrase "Good morning" is a standard greeting used in the morning. It expresses a wish for a good start to the day and serves as a way to establish a friendly connection between conversation participants. Logically, this greeting does not carry a hidden meaning; its main purpose is to create a positive atmosphere for communication.  

**Contextual Interpretation**  

This greeting is used in both formal and informal settings, usually between dawn and noon. The context of its use depends on the situation: in a work environment, it may serve as the beginning of a business conversation, while in a personal chat, it expresses friendliness. If the message is sent at a different time of day, it may be a mistake or a stylistic choice.  

**Emotional Evaluation**  

"Good morning" carries a positive emotional tone. It demonstrates friendliness, openness, and a wish for a pleasant day. If the recipient responds with a similar greeting, it confirms mutual politeness. Otherwise, the reaction may depend on the person's mood and the context of the conversation.  

**Cultural Significance**  

In many cultures, a morning greeting is an essential part of communication and may be accompanied by additional questions, such as "How are you?" or "How was your night?". Different languages have their own equivalents with various shades of meaning. For example, in English, "Good morning" is used similarly, while in Japanese, "おはようございます" (ohayou gozaimasu) has a more formal character.  
`

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Reasoning test",
      messages: [
        {
          role: "user",
          content: "Good morning!",
        },
        {
          role: "assistant",
          content: "Good morning! How can I assist you today?",
          reasoning: {
            text: reasoningText,
            timeSec: 150
          }
        },
      ],
    },
  ]);

  const { reasoningGenerator, streamGenerator } = useAssistantAnswerMock()

  const onUserMessageSent = async (params: MessageSentParams) => {
    const reasoningStream = reasoningGenerator();

    for await (const reasoningChunk of reasoningStream) {
      params.pushReasoningChunk(reasoningChunk);
    }

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }
  }

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableReasoning
        thread={threads[0]}
        threads={threads}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
