import * as React from 'react';
import { useChatSlots } from '../core/ChatSlotsContext';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { useGroupedMessages } from '../thread/useGroupedMessages';
import MessagesInGroup from './MessagesInGroup';

type Props = {
  messages: MessageModel[];
  thread: ThreadModel;
  gap: number;
};

const MessagesList: React.FC<Props> = ({ messages, thread, gap }) => {
  const { slots } = useChatSlots();
  const groupedMessages = useGroupedMessages(messages);

  return (
    <>
      <slots.firstMessage thread={thread} />
      {groupedMessages.map((groupMessages, key) => (
        <MessagesInGroup
          key={key}
          messages={groupMessages}
          gap={gap}
          isLatestGroup={key === groupedMessages.length -1}
          thread={thread}
        />
      ))}
    </>
  );
}

export default React.memo(MessagesList, (prevProps, nextProps) => {
  return prevProps.thread.id === nextProps.thread.id
    && arrayPluck(prevProps.messages, 'id').join() === arrayPluck(nextProps.messages, 'id').join('');
});
