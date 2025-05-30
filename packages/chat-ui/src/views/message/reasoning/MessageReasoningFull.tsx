import * as React from 'react';
import MessageMarkdownBlock, { ChatMarkdownBlockRoot } from '../markdown/MessageMarkdownBlock';
import { styled } from '@mui/material/styles';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  text: string;
  isProgress: boolean;
};

export const ChatMarkdownReasoningBlockRoot = styled(ChatMarkdownBlockRoot)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

const MessageReasoningFull: React.FC<Props> = ({ text, isProgress }) => {
  const { slots, slotProps } = useChatSlots();
  return (
    <MessageMarkdownBlock
      text={text}
      rootComponent={slots.markdownReasoningRoot}
      rootComponentProps={slotProps.markdownReasoningRoot}
      inProgress={isProgress}
    />
  );
}

export default MessageReasoningFull;
