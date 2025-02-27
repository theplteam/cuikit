import * as React from 'react';
import Stack from '@mui/material/Stack';
import ChatMarkdownBlock from '../markdown/ChatMarkdownBlock';

type Props = {
  text: string;
};

const MessageReasoningFull: React.FC<Props> = ({ text }) => {
  return (
    <Stack gap={2}>
      <ChatMarkdownBlock text={text} />
    </Stack>
  );
}

export default MessageReasoningFull;
