import * as React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';

const containerId = 'chat-ui-mobile-app-bar-container';

const MobileAppBarContainer: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <Box
      id={containerId}
      width="100%"
      sx={{
        display: isMobile ? 'block' : 'none',
        maxWidth: isMobile ? '100%' : 0,
        height: isMobile ? 'auto' : 0,
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    />
  )
};

const MobileAppBarContainerPortal = ({ children }: React.PropsWithChildren) => {
  return (
    <Portal container={() => document.getElementById(containerId)}>
      {children}
    </Portal>
  );
};

export { MobileAppBarContainer, MobileAppBarContainerPortal };
