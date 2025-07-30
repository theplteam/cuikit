import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { ChatMessageOwner, Message, MessageModel } from '../../../models/MessageModel';
import { useChatContext } from '../../core/ChatGlobalContext';
import { ThreadModel } from '../../../models/ThreadModel';
import MessageActionFeedback from './feedback/MessageActionFeedback';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  className?: string;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, thread, className }) => {
  const { actionsAssistant, disableMessageCopying, onChangeMessageRating } = useChatContext();

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.5}
      className={className}
    >
      {onChangeMessageRating ? <MessageActionFeedback message={message} /> : null}
      {!disableMessageCopying && <MessageActionCopy message={message} />}
      {actionsAssistant?.map((component, k) => (
        <component.element
          key={k}
          thread={thread.data}
          message={message.data as Extract<Message, { role: ChatMessageOwner.ASSISTANT }>}
        />
      ))}
    </Stack>
  );
}

export default MessageActionsAssistant;
