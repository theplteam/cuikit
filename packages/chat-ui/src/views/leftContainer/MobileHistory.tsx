import * as React from 'react';
import { HistoryProvider } from '../core/history/HistoryContext';
import { HistoryComponentProps } from './History';
import HistoryAppDrawer from './HistoryAppDrawer';

const MobileHistory: React.FC<HistoryComponentProps> = (props) => (
  <HistoryProvider {...props}>
    <HistoryAppDrawer className={props.className} />
  </HistoryProvider>
);

export default MobileHistory;
