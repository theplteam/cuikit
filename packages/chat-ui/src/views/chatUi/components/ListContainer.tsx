import * as React from 'react';
import { Portal } from '@mui/material';
import Box from '@mui/material/Box';
import { materialDesignSysPalette } from './../../../utils/materialDesign/palette';

const containerId = 'chat-ui-list-container';

const ListContainer = () => (
  <Box width="100%" id={containerId} sx={{ background: materialDesignSysPalette.surfaceContainerLow }} />
);

const ListContainerPortal = ({ children }: React.PropsWithChildren) => (
  <Portal container={() => document.getElementById(containerId)}>
    {children}
  </Portal>
);

export { ListContainer, ListContainerPortal };
