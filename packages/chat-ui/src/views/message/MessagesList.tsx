import * as React from 'react';
import ChatMessageComponent from './ChatMessageComponent';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Message } from '../../models/Message';
import { Dialogue } from '../../models/Dialogue';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';

type Props = {
  messages: Message[];
  dialogue: Dialogue;
};

const MessagesList: React.FC<Props> = ({ messages, dialogue }) => {
  const messagesLength = messages.length;
  const { slots } = useChatSlots();

  return (
    <>
      <slots.firstMessage dialogue={dialogue} />
      {messages.map((message, key) => (
        <ChatMessageComponent
          message={message}
          dialogue={dialogue}
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
  return prevProps.dialogue.id === nextProps.dialogue.id
    && arrayPluck(prevProps.messages, 'id').join() === arrayPluck(nextProps.messages, 'id').join('');
});
