import * as React from 'react';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';
import { BoxProps } from '@mui/material/Box';

const containerId = 'chat-ui-list-container';

const ListContainer: React.FC<BoxProps> = (props) => (
  <Box id={containerId} {...props} />
);

const ListContainerPortal = ({ children }: React.PropsWithChildren) => (
  <Portal container={() => document.getElementById(containerId)}>
    {children}
  </Portal>
);

export { ListContainer, ListContainerPortal };
