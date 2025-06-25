import * as React from 'react';
import { HistoryProvider } from '../core/history/HistoryContext';
import ChatHistory from './ChatHistory';
import AppDrawer from './AppDrawer';
import Box from '@mui/material/Box';
import { HistoryComponentProps } from './History';

const MobileHistory: React.FC<HistoryComponentProps> = (props) => (
  <HistoryProvider {...props}>
    <AppDrawer>
      <Box display="flex" flexDirection="column" height={500}>
        <ChatHistory />
      </Box>
    </AppDrawer>
  </HistoryProvider>
);

export default MobileHistory;
