import * as React from "react";
import {
  ChatPage,
  Thread, MessageSentParams,
  useAssistantAnswerMock,
} from "@plteam/chat-ui";
import threadsJson from '../testThreads.json';
import Box from "@mui/material/Box";

const testText = `
START

Hi! Do you know anything about traveling to Japan?

Hi! Yes, I know a bit. What specifically do you want to know? Transportation, culture, or something else?

I'm curious about transportation. How does the train system work?

Japan has an excellent train system. There are high-speed trains called Shinkansen connecting major cities, and regional lines are great for shorter trips.

That sounds amazing. Do I need to buy tickets in advance?

Yes, it's a good idea to reserve tickets for Shinkansen, especially during holidays. For regional trains, you can usually buy tickets at the station.

Test

Hi! Do you know anything about traveling to Japan?

Hi! Yes, I know a bit. What specifically do you want to know? Transportation, culture, or something else?

I'm curious about transportation. How does the train system work?

Japan has an excellent train system. There are high-speed trains called Shinkansen connecting major cities, and regional lines are great for shorter trips.

That sounds amazing. Do I need to buy tickets in advance?

Yes, it's a good idea to reserve tickets for Shinkansen, especially during holidays. For regional trains, you can usually buy tickets at the station. Test

This was an example of waiting statuses for the assistant's response.

Hi! Do you know anything about traveling to Japan?

Hi! Yes, I know a bit. What specifically do you want to know? Transportation, culture, or something else?

I'm curious about transportation. How does the train system work?

Japan has an excellent train system. There are high-speed trains called Shinkansen connecting major cities, and regional lines are great for shorter trips.

That sounds amazing. Do I need to buy tickets in advance?

Yes, it's a good idea to reserve tickets for Shinkansen, especially during holidays. For regional trains, you can usually buy tickets at the station. Test

This was an example of waiting statuses for the assistant's response.

123

This was an example of waiting statuses for the assistant's response.

END
`;

const awaitSeconds = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsJson);
  const { streamGenerator } = useAssistantAnswerMock();

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    await awaitSeconds(2);
    params.setStatus('We\'ve been waiting for 2 seconds already.');
    await awaitSeconds(3);
    params.setStatus('And another 3 seconds.');
    await awaitSeconds(3);
    params.setStatus('We\'re almost finished.');
    await awaitSeconds(3);
    params.setStatus('Done');
    await awaitSeconds(1);

    const stream = streamGenerator(testText);
    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }

    params.onFinish();
  }, []);

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        enableReasoning
        defaultTextFieldValue="Test" initialThread={threads[0]} threads={threads}
        initialThreadMessage={(id) => ({ text: `${id} Yes, it's a good idea to reserve tickets for Shinkansen, especially during holidays. For regional trains, you can usually buy tickets at the station.`, stream: true })}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
