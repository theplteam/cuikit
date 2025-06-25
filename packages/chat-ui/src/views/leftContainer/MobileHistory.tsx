import * as React from 'react';
import { HistoryProvider } from '../core/history/HistoryContext';
import { HistoryComponentProps } from './History';
import HistoryAppDrawer from './HistoryAppDrawer';

const MobileHistory: React.FC<HistoryComponentProps> = (props) => (
  <HistoryProvider {...props}>
    <HistoryAppDrawer />
  </HistoryProvider>
);

export default MobileHistory;
