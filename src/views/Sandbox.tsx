import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, Message, AdapterProvider,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { arrayLast } from '../../packages/chat-ui/src/utils/arrayUtils/arrayLast.ts';
import { DialogueMessages } from './DialogueMessages.ts';

let index = 3;
const manager = new DialogueMessages();

class ThreadModel {
  data: Thread = {
    id: "test-thread",
    title: "Welcome message",
    messages: [
      {
        id: 'user1',
        role: "user",
        content: "Hello!",
      },
      {
        id: 'assistant2',
        role: "assistant",
        content: "Hello there! How can I assist you today?",
        parentId: 'user1',
      },
    ],
  }
}

const threadModel = new ThreadModel();

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([threadModel.data]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock({ loremIpsumSize: 'small' });

  return (
    <AdapterProvider>
      <Box height="100dvh" width="100dvw">
        <ChatPage
          enableBranches
          thread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          beforeUserMessageSend={({ text, history, parentMessage: _parentMessage, reason }) => {
            let parentMessage = arrayLast(history.filter((m) => m.role === 'user'));
            if (reason === 'editMessage') {
              parentMessage = _parentMessage;
            }

            const userMessageId = 'user' + index;
            console.log(userMessageId, parentMessage, history);
            index++;
            const data = {
              userMessage: {
                id: userMessageId,
                role: 'user',
                content: text,
                parentId: parentMessage?.id,
              } as Message,
              assistantMessage: {
                id: 'assistant' + index,
                role: 'assistant',
                content: '',
                parentId: userMessageId,
              } as Message,
            };

            threadModel.data.messages.push(data.userMessage, data.assistantMessage);
            return data;
          }}
          defaultTextFieldValue="test"
          getCurrentBranch={(lastMessage: Message | undefined) => {
            console.log('MESSAGES', [...threadModel.data.messages]);
            return manager.getBranch(threadModel.data.messages, lastMessage)
          }}
          onUserMessageSent={(params) => {
            // console.log(params.history);
            onUserMessageSent(params);
          }}
        />
      </Box>

    </AdapterProvider>
  );
}

export default App;
