import * as React from 'react';
import { HistoryProvider } from '../core/history/HistoryContext';
import { HistoryComponentProps } from './History';
import HistoryContainer from './HistoryContainer';

const DesktopHistory: React.FC<HistoryComponentProps> = (props) => (
  <HistoryProvider {...props}>
    <HistoryContainer className={props.className} />
  </HistoryProvider>
);

export default DesktopHistory;
