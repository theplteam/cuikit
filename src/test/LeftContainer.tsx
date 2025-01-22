import * as React from 'react';
import { Portal } from '@mui/base/Portal';
import { Box } from '@mui/system';

const containerId = 'chat-test-left-container';

const LeftContainer = () => (
  <Box
    minWidth={300}
    maxWidth={360}
    position={'sticky'}
    top={0}
    sx={{
      background: "#F1F4F9",
    }}
    id={containerId}
  />
);

const LeftContainerPortal = ({ children }: React.PropsWithChildren) => (
  <Portal container={() => document.getElementById(containerId)}>
    {children}
  </Portal>
);

export { LeftContainer, LeftContainerPortal };


