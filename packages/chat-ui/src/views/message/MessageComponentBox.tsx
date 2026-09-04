import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type Props = {
  isUser: boolean;
} & BoxProps;

/**
 * Keeps a message off the very top edge when it is scrolled to from the navigation rail.
 */
const SCROLL_MARGIN_TOP = 24;

const MessageComponentBox = React.forwardRef<HTMLDivElement, Props>(({ isUser, children, sx, ...boxProps }, ref) => {
  return (
    <Box
      {...boxProps}
      ref={ref}
      sx={[{ scrollMarginTop: SCROLL_MARGIN_TOP }, ...(Array.isArray(sx) ? sx : [sx])]}
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      display="flex"
      width="100%"
      boxSizing="border-box"
    >
      {children}
    </Box>
  );
});

export default MessageComponentBox;
