import * as React from 'react';
import MessageMarkdownBlock, { ChatMarkdownBlockRoot } from '../markdown/MessageMarkdownBlock';
import { styled } from '@mui/material/styles';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { IdType } from '../../../types';

type Props = {
  messageId: IdType;
  text: string;
  isProgress: boolean;
};

export const ChatMarkdownReasoningBlockRoot = styled(ChatMarkdownBlockRoot)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

const MessageReasoningFull: React.FC<Props> = ({ text, isProgress, messageId }) => {
  const { slots, slotProps } = useChatSlots();
  return (
    <MessageMarkdownBlock
      messageId={messageId}
      text={text}
      rootComponent={slots.markdownReasoningRoot}
      rootComponentProps={slotProps.markdownReasoningRoot}
      inProgress={isProgress}
    />
  );
}

export default MessageReasoningFull;
