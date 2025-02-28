import * as React from 'react';
import MessageReasoning from './reasoning/MessageReasoning';
import { MessageModel, ThreadModel } from '../../models';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {
  thread: ThreadModel;
  message: MessageModel;
};

const MessagePreloading: React.FC<Props> = ({ thread, message }) => {
  const { slots, slotProps } = useChatSlots();
  const [expanded, setExpanded] = React.useState(false);

  const reasoning = useObserverValue(message.reasoning) ?? '';

  const handleExpandedChange = () => {
    setExpanded(!expanded);
  }

  return (
    <>
      <slots.messageAssistantProgress
        {...slotProps.messageAssistantProgress}
        thread={thread}
        onClick={reasoning ? handleExpandedChange : undefined}
      />
      <MessageReasoning
        message={message}
        thread={thread}
      />
    </>
  );
}

export default MessagePreloading;
