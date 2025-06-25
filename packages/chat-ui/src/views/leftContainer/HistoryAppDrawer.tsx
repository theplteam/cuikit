import * as React from 'react';
import Box from '@mui/material/Box';
import AppDrawer from './AppDrawer';
import ChatHistory from './ChatHistory';

const HistoryAppDrawer: React.FC<{ className?: string }> = ({ className }) => (
  <AppDrawer className={className}>
    <Box display="flex" flexDirection="column" height={500}>
      <ChatHistory />
    </Box>
  </AppDrawer>
);

export default HistoryAppDrawer;
