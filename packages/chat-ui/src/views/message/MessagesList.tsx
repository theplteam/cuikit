import * as React from 'react';
import ChatMessageComponent from './ChatMessageComponent';
import { useChatSlots } from '../core/ChatSlotsContext';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';

type Props = {
  messages: MessageModel[];
  thread: ThreadModel;
};

const MessagesList: React.FC<Props> = ({ messages, thread }) => {
  const messagesLength = messages.length;
  const { slots } = useChatSlots();

  return (
    <>
      <slots.firstMessage thread={thread} />
      {messages.map((message, key) => (
        <ChatMessageComponent
          message={message}
          thread={thread}
          key={message.id ?? key}
          isFirst={!key}
          isLatest={key === messagesLength -1}
          enableAssistantActions
        />
      ))}
    </>
  );
}

export default React.memo(MessagesList, (prevProps, nextProps) => {
  return prevProps.thread.id === nextProps.thread.id
    && arrayPluck(prevProps.messages, 'id').join() === arrayPluck(nextProps.messages, 'id').join('');
});
