import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

type Props = BoxProps;

const DialogueRootContainer: React.FC<Props> = (boxProps) => {
  return (
    <Box
      width={'100%'}
      display={'flex'}
      justifyContent={'center'}
      height={'inherit'}
    >
      <Box
        width={'100%'}
        maxWidth={760}
        display={'flex'}
        flexDirection={'column'}
        {...boxProps}
      />
    </Box>
  );
}

export default DialogueRootContainer;
