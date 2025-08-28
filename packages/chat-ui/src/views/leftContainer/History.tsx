import * as React from 'react';
import { HistoryProps } from '../core/history/HistoryType';
import { ApiRefType } from '../core/useApiRef';
import { HistoryProvider } from '../core/history/HistoryContext';
import HistoryContainer from './HistoryContainer';
import HistoryAppDrawer from './HistoryAppDrawer';

export type HistoryComponentProps = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
  isMobile?: boolean;
  loading?: boolean;
  lang?: string;
} & Partial<HistoryProps>;

const History: React.FC<HistoryComponentProps> = (props) => {
  const { isMobile, className, ...other } = props;

  return (
    <HistoryProvider {...other}>
      {isMobile
        ? (
          <HistoryAppDrawer className={className} />
        ) : (
          <HistoryContainer className={className} />
        )}
    </HistoryProvider>
  );
};

export default History;
