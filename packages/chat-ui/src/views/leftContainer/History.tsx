import * as React from 'react';
import { HistoryProps } from '../core/history/HistoryType';
import { ApiRefType } from '../core/useApiRef';
import { HistoryProvider } from '../core/history/HistoryContext';
import HistoryContainer from './HistoryContainer';
import HistoryAppDrawer from './HistoryAppDrawer';
import { LangKeys } from '../../locale/Localization';
import { useMobile } from '../../ui/Responsive';

export type HistoryComponentProps = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading?: boolean;
  lang?: LangKeys;
} & Partial<HistoryProps>;

const History: React.FC<HistoryComponentProps> = (props) => {
  const { className, ...other } = props;
  const isMobile = useMobile();

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
