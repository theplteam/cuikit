import * as React from 'react';
import Box from '@mui/material/Box';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  isTyping: boolean | undefined;
  isLoadingFullData: boolean | undefined;
  text: string;
  images: string[];
  onSendMessage: () => void;
};

const SendMessageButton: React.FC<Props> = ({ text, images, onSendMessage, isTyping, isLoadingFullData }) => {
  const disabled = !!isLoadingFullData || (!text && !images.length);
  const { slots, slotProps } = useChatSlots();
  const { handleStopMessageStreaming } = useChatContext();

  const onClick = () => {
    if (isTyping) {
      handleStopMessageStreaming?.();
    } else {
      onSendMessage();
    }
  };
  return (
    <Box
      display="flex"
      alignItems="flex-end"
      justifyContent="center"
      width={48}
      height={40}
      position="relative"
    >
      <slots.sendMessageButton
        {...slotProps.sendMessageButton}
        disabled={disabled || (!handleStopMessageStreaming && !!isTyping)}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          height: '48px',
          width: '48px',
          transition: (theme) => theme.transitions.create('color', { duration: '200ms' }),
          ...slotProps.sendMessageButton?.sx,
        }}
        onClick={onClick}
      >
        {(!!isTyping && !!handleStopMessageStreaming) ? <slots.stopStreamIcon /> : <slots.sendMessageIcon />}
      </slots.sendMessageButton>
    </Box>
  );
};

export default SendMessageButton;
