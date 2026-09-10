import * as React from 'react';
import Box from '@mui/material/Box';
import AppDrawer from './AppDrawer';
import ChatHistory from './ChatHistory';
import { HISTORY_DRAWER_HEIGHT } from './listMap/historyListMetrics';

const HistoryAppDrawer: React.FC<{ className?: string }> = ({ className }) => (
  <AppDrawer className={className}>
    <Box display="flex" flexDirection="column" height={HISTORY_DRAWER_HEIGHT}>
      <ChatHistory />
    </Box>
  </AppDrawer>
);

export default HistoryAppDrawer;
