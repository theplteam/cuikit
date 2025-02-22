import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { chatClassNames } from '../core/chatClassNames';
import clsx from 'clsx';

type Props = BoxProps;

const ThreadRootContainer: React.FC<Props> = (boxProps) => {
  return (
    <Box
      width={'100%'}
      display={'flex'}
      justifyContent={'center'}
      height={'inherit'}
      className={chatClassNames.threadRoot}
    >
      <Box
        width={'100%'}
        maxWidth={760}
        display={'flex'}
        flexDirection={'column'}
        {...boxProps}
        className={clsx(chatClassNames.threadRoot, boxProps.className)}
      />
    </Box>
  );
}

export default ThreadRootContainer;
