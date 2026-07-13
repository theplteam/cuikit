import * as React from 'react';
import MessageMarkdownBlock, { ChatMarkdownBlockRoot } from '../markdown/MessageMarkdownBlock';
import { styled } from '@mui/material/styles';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { IdType } from '../../../types';

type Props = {
  text: string;
  messageId: IdType;
  isProgress: boolean;
};

export const ChatMarkdownReasoningBlockRoot = styled(ChatMarkdownBlockRoot)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const MessageReasoningFull: React.FC<Props> = ({ text, messageId, isProgress }) => {
  const { slots, slotProps } = useChatSlots();
  return (
    <MessageMarkdownBlock
      text={text}
      messageId={messageId}
      rootComponent={slots.markdownReasoningRoot}
      rootComponentProps={slotProps.markdownReasoningRoot}
      inProgress={isProgress}
    />
  );
}

export default MessageReasoningFull;
