import * as React from 'react';
import { HistoryProps } from '../core/history/HistoryType';
import { ApiRefType } from '../core/useApiRef';
import { HistoryProvider } from '../core/history/HistoryContext';
import HistoryContainer from './HistoryContainer';

export type HistoryComponentProps = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading?: boolean;
  lang?: string;
} & Partial<HistoryProps>;

const History: React.FC<HistoryComponentProps> = (props) => (
  <HistoryProvider {...props}>
    <HistoryContainer className={props.className} />
  </HistoryProvider>
);

export default History;
