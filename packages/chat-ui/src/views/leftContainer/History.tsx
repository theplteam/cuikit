import * as React from 'react';
import { HistoryProps } from '../core/history/HistoryType';
import { ApiRefType } from '../core/useApiRef';
import { HistoryProvider } from '../core/history/HistoryContext';
import ChatHistory from './ChatHistory';
import { useMobile } from '../../ui/Responsive';
import AppDrawer from './AppDrawer';
import Box from '@mui/material/Box';
import HistoryContainer from './HistoryContainer';

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
          <AppDrawer>
            <Box display="flex" flexDirection="column" height={500}>
              <ChatHistory />
            </Box>
          </AppDrawer>
        ) : (
          <HistoryContainer className={props.className} />
        )}
    </HistoryProvider>
  );
};

export default History;
