import * as React from 'react';
import ChatMarkdownBlock, { ChatMarkdownBlockRoot } from '../markdown/ChatMarkdownBlock';
import { styled } from '@mui/material/styles';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  text: string;
};

export const ChatMarkdownReasoningBlockRoot = styled(ChatMarkdownBlockRoot)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

const MessageReasoningFull: React.FC<Props> = ({ text }) => {
  const { slots, slotProps } = useChatSlots();
  return (
    <ChatMarkdownBlock
      text={text}
      rootComponent={slots.markdownReasoningRoot}
      rootComponentProps={slotProps.markdownReasoningRoot}
      inProgress={false}
    />
  );
}

export default MessageReasoningFull;
