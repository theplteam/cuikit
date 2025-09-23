import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { ChatMessageOwner, Message, MessageModel, ThreadModel } from '../../../models';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageActionFeedback from './feedback/MessageActionFeedback';
import clsx from 'clsx';
import { chatClassNames } from '../../core/chatClassNames';
import MessageActionReload from './MessageActionReload';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  className: string;
  isTypedOnce: boolean;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, thread, className, isTypedOnce }) => {
  const { actionsAssistant, disableMessageCopying, onChangeMessageRating, disableMessageReloading } = useChatContext();

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      className={clsx(
        className,
        { [chatClassNames.markdownSmoothedPending]: isTypedOnce }
      )}
    >
      {onChangeMessageRating ? <MessageActionFeedback message={message} /> : null}
      {!disableMessageReloading && <MessageActionReload message={message} />}
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
