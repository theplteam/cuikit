import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { Message } from '../../../models/Message';
import { useChatContext } from '../../core/ChatGlobalContext';
import { Dialogue } from '../../../models/Dialogue';
import MessageActionDislike from './MessageActionDislike';
import MessageActionLike from './MessageActionLike';

type Props = {
  message: Message;
  dialogue: Dialogue;
  className: string;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, dialogue, className }) => {
  const { actionsAssistant } = useChatContext();
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={1.5}
      className={className}
    >
      <MessageActionCopy message={message} />
      <MessageActionLike message={message} />
      <MessageActionDislike message={message} />
      {actionsAssistant?.map((component, k) => (
        <component.element
          dialogue={dialogue}
          message={message}
          key={k}
        />
      ))}
    </Stack>
  );
}

export default MessageActionsAssistant;
