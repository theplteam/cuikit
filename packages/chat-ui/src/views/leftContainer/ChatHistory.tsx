import * as React from 'react';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import SimpleScrollbar from '../../ui/SimpleScrollbar';
import ThreadsListMapBlock from './listMap/ThreadsListMapBlock';
import { useHistoryContext } from '../core/history/HistoryContext';

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
      <NewChatButton openNewThread={openNewThread} />
      <Box mx={2} mb={0.5}>
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {locale.historyTitle}
        </slots.listSubtitle>
      </Box>
      <Box overflow="hidden">
        <SimpleScrollbar style={{ maxHeight: '100%' }}>
          <ThreadsListMapBlock />
        </SimpleScrollbar>
      </Box>
    </slots.historyWrapper>
  );
}

export default ChatHistory;
