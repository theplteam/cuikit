import * as React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import { BoxProps } from '@mui/material/Box';

const containerId = 'chat-ui-mobile-app-bar-container';

const MobileAppBarContainer: React.FC<BoxProps> = (props) => (
  <Box
    id={containerId}
    {...props}
  />
);

const MobileAppBarContainerPortal = ({ children }: React.PropsWithChildren) => (
  <Portal container={() => document.getElementById(containerId)}>
    {children}
  </Portal>
);

export { MobileAppBarContainer, MobileAppBarContainerPortal };
