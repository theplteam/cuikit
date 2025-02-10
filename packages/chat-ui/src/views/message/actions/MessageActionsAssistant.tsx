import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageActionCopy from './MessageActionCopy';
import { MessageLight } from '../../../models/Message';
import { useChatContext } from '../../core/ChatGlobalContext';
import { DialogueLight } from '../../../models/Dialogue';

type Props = {
  message: MessageLight;
  dialogue: DialogueLight;
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
