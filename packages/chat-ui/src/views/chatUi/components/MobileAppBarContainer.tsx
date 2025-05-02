import * as React from 'react';
import { Portal } from '@mui/material';
import Box from '@mui/material/Box';

const containerId = 'chat-ui-mobile-app-bar-container';

const MobileAppBarContainer: React.FC = () => (
  <Box id={containerId} />
);

const MobileAppBarContainerPortal = ({ children }: React.PropsWithChildren) => (
  <Portal container={() => document.getElementById(containerId)}>
    {children}
  </Portal>
);

export { MobileAppBarContainer, MobileAppBarContainerPortal };
