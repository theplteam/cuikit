import * as React from 'react';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import Scrollbar from '../../ui/Scrollbar';
import ThreadsListMapBlock from './listMap/ThreadsListMapBlock';
import { useHistoryContext } from '../core/history/HistoryContext';
import AIModelSelect from './AIModelSelect';
import { Stack } from '@mui/material';

const ChatHistory: React.FC = () => {
  const { slots, slotProps, apiRef, locale } = useHistoryContext();

  const openNewThread = () => {
    const thread = apiRef.current?.handleCreateNewThread?.();
    if (thread) {
      apiRef.current?.openNewThread(thread);
    }
  };

  return (
    <slots.historyWrapper
      gap={2}
      height="100%"
      width="100%"
      {...slotProps.historyWrapper}
    >
      <Stack
        pt={1.5}
        px={2}
        gap={2}
      >
        <AIModelSelect />
        <NewChatButton openNewThread={openNewThread} />
      </Stack>
      <Box mx={2} mb={0.5}>
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {locale.historyTitle}
        </slots.listSubtitle>
      </Box>
      <Box overflow="hidden">
        <Scrollbar style={{ maxHeight: '100%' }}>
          <ThreadsListMapBlock />
        </Scrollbar>
      </Box>
    </slots.historyWrapper>
  );
}

export default ChatHistory;
