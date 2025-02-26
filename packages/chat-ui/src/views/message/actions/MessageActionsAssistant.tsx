import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { MessageModel } from '../../../models/MessageModel';
import { useChatContext } from '../../core/ChatGlobalContext';
import { ThreadModel } from '../../../models/ThreadModel';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  className: string;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, thread, className }) => {
  const { actionsAssistant, disableMessageCopying } = useChatContext();
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.5}
      className={className}
    >
      {!disableMessageCopying && <MessageActionCopy message={message} />}
      {/*!disableMessageRating && <MessageActionFeedback message={message} />*/}
      {actionsAssistant?.map((component, k) => (
        <component.element
          key={k}
          thread={thread.data.data}
          message={message.data}
        />
      ))}
    </Stack>
  );
}

export default MessageActionsAssistant;
