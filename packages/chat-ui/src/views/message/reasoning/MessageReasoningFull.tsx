import * as React from 'react';
import ChatMarkdownBlock from '../markdown/ChatMarkdownBlock';
import { styled } from '@mui/material/styles';

type Props = {
  text: string;
};

const ChatMarkdownBlockStyled = styled(ChatMarkdownBlock)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

const MessageReasoningFull: React.FC<Props> = ({ text }) => {
  return <ChatMarkdownBlockStyled text={text} />;
}

export default MessageReasoningFull;
