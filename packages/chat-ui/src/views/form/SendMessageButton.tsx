import * as React from 'react';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StopIcon from '@mui/icons-material/Stop';
import { styled } from '@mui/material/styles';
import MdIconButton from '../../ui/MdIconButton';
import { ChatDialogue } from '../../models/ChatDialogue';

type Props = {
  dialogue: ChatDialogue | undefined;
  isTyping: boolean | undefined;
  text: string;
  onSendMessage: () => void;
};

const MdIconButtonStyled = styled(MdIconButton)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  height: '48px',
  transition: theme.transitions.create('color', { duration: theme.m3.sys.motion.duration.short4 }),
}));

const SendMessageButton: React.FC<Props> = ({ dialogue, text, onSendMessage, isTyping }) => {
  const disabled = !isTyping && !text;

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
      <MdIconButtonStyled
        disabled={disabled}
        onClick={onClick}
      >
        {!!isTyping ? <StopIcon /> : <ArrowUpwardIcon/>}
      </MdIconButtonStyled>
    </Box>
  );
};

export default SendMessageButton;
