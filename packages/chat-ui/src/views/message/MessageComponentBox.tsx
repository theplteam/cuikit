import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type Props = {
  isUser: boolean;
} & BoxProps;

const MessageComponentBox: React.FC<Props> = ({ isUser, children, ...boxProps }) => {
  return (
    <Box
      {...boxProps}
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      display="flex"
      width="100%"
      boxSizing="border-box"
    >
      {children}
    </Box>
  );
}

export default MessageComponentBox;
