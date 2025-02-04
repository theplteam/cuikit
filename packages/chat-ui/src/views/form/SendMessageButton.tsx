import * as React from 'react';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StopIcon from '@mui/icons-material/Stop';
import { DialogueAbstract } from '../../models/DialogueAbstract';
import { useChatCoreSlots } from '../core/ChatSlotsContext';

type Props = {
  dialogue: DialogueAbstract | undefined;
  isTyping: boolean | undefined;
  text: string;
  onSendMessage: () => void;
};


const SendMessageButton: React.FC<Props> = ({ dialogue, text, onSendMessage, isTyping }) => {
  const disabled = !isTyping && !text;
  const coreSlots = useChatCoreSlots();

  const onClick = () => {
    if (isTyping) {
      dialogue?.closeConnection?.();
    } else {
      onSendMessage();
    }
  };
  return (
    <Box
      display={'flex'}
      alignItems={'flex-end'}
      width={48}
      height={40}
      position={'relative'}
    >
      <coreSlots.iconButton
        disabled={disabled}
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          height: '48px',
          transition: (theme) => theme.transitions.create('color', { duration: '200ms' }),
        }}
      >
        {!!isTyping ? <StopIcon /> : <ArrowUpwardIcon/>}
      </coreSlots.iconButton>
    </Box>
  );
};

export default SendMessageButton;
