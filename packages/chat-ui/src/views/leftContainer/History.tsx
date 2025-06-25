import * as React from 'react';
import { HistoryProps } from '../core/history/HistoryType';
import { ApiRefType } from '../core/useApiRef';
import { HistoryProvider } from '../core/history/HistoryContext';
import { useMobile } from '../../ui/Responsive';
import HistoryContainer from './HistoryContainer';
import HistoryAppDrawer from './HistoryAppDrawer';

export type HistoryComponentProps = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading?: boolean;
  lang?: string;
} & Partial<HistoryProps>;

const History: React.FC<HistoryComponentProps> = (props) => {
  const isMobile = useMobile();

  return (
    <HistoryProvider {...props}>
      {isMobile
        ? (
          <HistoryAppDrawer />
        ) : (
          <HistoryContainer className={props.className} />
        )}
    </HistoryProvider>
  );
};

export default History;
