import * as React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';

const containerId = 'chat-ui-list-container';

const ListContainer: React.FC<{ isMobile: boolean, isTablet: boolean }> = ({ isMobile, isTablet }) => {
  return (
    <Box
      id={containerId}
      width="100%"
      height="100%"
      sx={{
        display: isMobile ? 'none' : 'flex',
        maxWidth: isMobile ? 0 : isTablet ? 220 : 360,
        height: isMobile ? 0 : '100%',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    />
  )
};

const ListContainerPortal = ({ children }: React.PropsWithChildren) => {
  return (
    <Portal container={() => document.getElementById(containerId)}>
      {children}
    </Portal>
  );
};

export { ListContainer, ListContainerPortal };
