import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { ChatMessage } from '../../../models/ChatMessage';
import { useChatContext } from '../../ChatGlobalContext';

type Props = {
  message: ChatMessage;
  className: string;
};

const MessageActionsAssistant: React.FC<Props> = ({ message, className }) => {
  const { actionsAssistant } = useChatContext();
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={1.5}
      className={className}
    >
      <MessageActionCopy message={message} />
      {actionsAssistant}
    </Stack>
  );
}

export default MessageActionsAssistant;
