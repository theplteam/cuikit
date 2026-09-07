import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import clsx from 'clsx';
import { chatClassNames, chatCssVariables } from '../core/chatClassNames';

type Props = {
  isUser: boolean;
} & BoxProps;

/**
 * Keeps a message off the very top edge when it is scrolled to from the navigation rail
 * or the imperative api. Hosts with a sticky header of their own raise it by setting
 * `chatCssVariables.messageScrollMarginTop` on any ancestor.
 */
const SCROLL_MARGIN_TOP_FALLBACK = 24;

const MessageComponentBox = React.forwardRef<HTMLDivElement, Props>(({ isUser, children, className, sx, ...boxProps }, ref) => {
  return (
    <Box
      {...boxProps}
      ref={ref}
      className={clsx(chatClassNames.messageRoot, className)}
      sx={[
        { scrollMarginTop: `var(${chatCssVariables.messageScrollMarginTop}, ${SCROLL_MARGIN_TOP_FALLBACK}px)` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
