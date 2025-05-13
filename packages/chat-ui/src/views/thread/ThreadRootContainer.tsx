import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { chatClassNames } from '../core/chatClassNames';

type Props = BoxProps;

const ThreadRootContainer: React.FC<Props> = ({ id, ...boxProps }) => {
  return (
    <Box
      id={id}
      width="100%"
      display="flex"
      justifyContent="center"
      height="inherit"
      className={chatClassNames.threadRoot}
    >
      <Box
        width="100%"
        maxWidth={760}
        display="flex"
        flexDirection="column"
        {...boxProps}
        className={boxProps.className}
      />
    </Box>
  );
}

export default ThreadRootContainer;
