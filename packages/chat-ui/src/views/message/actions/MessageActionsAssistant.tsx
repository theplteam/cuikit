import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { Message } from '../../../models/Message';
import { useChatContext } from '../../core/ChatGlobalContext';
import { Dialogue } from '../../../models/Dialogue';

type Props = {
  message: Message;
  dialogue: Dialogue;
  className: string;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, dialogue, className }) => {
  const { actionsAssistant, disableMessageCopying } = useChatContext();
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={1.5}
      className={className}
    >
      {!disableMessageCopying && <MessageActionCopy message={message}/>}
      {/*!disableMessageRating && <MessageActionFeedback message={message} />*/}
      {actionsAssistant?.map((component, k) => (
        <component.element
          dialogue={dialogue.data.data}
          message={message.data}
          key={k}
        />
      ))}
    </Stack>
  );
}

export default MessageActionsAssistant;
