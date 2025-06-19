import * as React from 'react';
import { ThreadListProps } from '../../core/threadList/ThreadListType';
import { ApiRefType } from '../../core/useApiRef';
import { ThreadListProvider } from '../../core/threadList/ThreadListContext';
import { useThreadListInit } from './useThreadListInit';
import History from '../../leftContainer/History';
import { useMobile, useTablet } from '../../../ui/Responsive';
import AppDrawer from '../../leftContainer/AppDrawer';
import Box from '@mui/material/Box';

export type ChatHistoryProps = {
  apiRef: React.MutableRefObject<ApiRefType | null>;
  loading?: boolean;
  lang?: string;
} & Partial<ThreadListProps>;

const ChatHistory: React.FC<ChatHistoryProps> = (props) => {
  const providerData = useThreadListInit(props)
  const isMobile = useMobile();
  const isTablet = useTablet();

  return (
    <ThreadListProvider {...providerData}>
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
            sx={{
              maxWidth: isTablet ? 220 : 360,
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
            {...providerData.slotProps.historyContainer}
          >
            <History />
          </providerData.slots.historyContainer>
        )}
    </ThreadListProvider >
  );
};

export default ChatHistory;
