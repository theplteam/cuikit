import * as React from 'react';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useChatContext } from '../core/ChatGlobalContext';
import { motion } from '../../utils/materialDesign/motion';

type Props = {
  onSendMessage: () => void;
  isTyping?: boolean;
  disabled?: boolean;
};

const SendMessageButton: React.FC<Props> = ({ onSendMessage, isTyping, disabled }) => {
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
    <div>
      <slots.sendMessageButton
        {...slotProps.sendMessageButton}
        disabled={disabled || (!handleStopMessageStreaming && !!isTyping)}
        sx={{
          transition: (theme) => theme.transitions.create('color', { duration: motion.duration.short4 }),
          ...slotProps.sendMessageButton?.sx,
        }}
        onClick={onClick}
      >
        {(!!isTyping && !!handleStopMessageStreaming) ? <slots.stopStreamIcon /> : <slots.sendMessageIcon />}
      </slots.sendMessageButton>
    </div>
  );
};

export default SendMessageButton;
