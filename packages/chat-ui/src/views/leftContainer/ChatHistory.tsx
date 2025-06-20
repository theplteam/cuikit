import * as React from 'react';
import { HistoryProps } from '../core/history/HistoryType';
import { ApiRefType } from '../core/useApiRef';
import { HistoryProvider } from '../core/history/HistoryContext';
import { useHistoryInit } from '../core/history/useHistoryInit';
import History from './History';
import { useMobile, useTablet } from '../../ui/Responsive';
import AppDrawer from './AppDrawer';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { historyClassNames } from '../core/history/historyClassNames';

export type ChatHistoryProps = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading?: boolean;
  lang?: string;
} & Partial<HistoryProps>;

const ChatHistory: React.FC<ChatHistoryProps> = (props) => {
  const providerData = useHistoryInit(props)
  const isMobile = useMobile();
  const isTablet = useTablet();

  return (
    <HistoryProvider {...providerData}>
      {isMobile
        ? (
          <AppDrawer>
            <Box display="flex" flexDirection="column" height={500}>
              <History />
            </Box>
          </AppDrawer>
        ) : (
          <providerData.slots.historyContainer
            width="100%"
            height="100%"
            className={clsx(historyClassNames.historyContainer, props.className)}
            sx={{
              maxWidth: isTablet ? 220 : 360,
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
            {...providerData.slotProps.historyContainer}
          >
            <History />
          </providerData.slots.historyContainer>
        )}
    </HistoryProvider>
  );
};

export default ChatHistory;
