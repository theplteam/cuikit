import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { ChatMessage } from '../../../models/ChatMessage';
import { ChatDialogue } from '../../../models/ChatDialogue';

type Props = {
  message: ChatMessage;
  dialogue: ChatDialogue;
  className: string;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, dialogue, className }) => {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={1.5}
      className={className}
    >
      <MessageActionCopy message={message} />
    </Stack>
  );
}

export default MessageActionsAssistant;
