import * as React from 'react';
import ChatMessageComponent from './ChatMessageComponent';
import { useChatSlots } from '../ChatGlobalContext';
import { ChatMessage } from '../../models/ChatMessage';
import { ChatDialogue } from '../../models/ChatDialogue';

type Props = {
  messages: ChatMessage[];
  dialogue: ChatDialogue;
};

const MessagesList: React.FC<Props> = ({ messages, dialogue }) => {
  const messagesLength = messages.length;
  const slots = useChatSlots();

  return (
    <>
      <slots.firstMessage dialogue={dialogue} />
      {messages.map((message, key) => (
        <ChatMessageComponent
          message={message}
          dialogue={dialogue}
          key={message.id}
          isFirst={!key}
          isLatest={key === messagesLength -1}
          enableAssistantActions
        />
      ))}
    </>
  );
}

export default React.memo(MessagesList, (prevProps, nextProps) => {
  return prevProps.messages.length === nextProps.messages.length && prevProps.dialogue.id === nextProps.dialogue.id;
});
