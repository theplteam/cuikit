import * as React from 'react';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import useThrottledResizeObserver from '../hooks/useThrottledResizeObserver';
import Scrollbar from '../../ui/Scrollbar';
import ThreadsListMapBlock from './listMap/ThreadsListMapBlock';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

const ThreadsList: React.FC = () => {
  const { ref, height } = useThrottledResizeObserver(1000);
  const { slots, slotProps, apiRef, locale } = useThreadListContext();

  const openNewThread = () => {
    const thread = apiRef.current?._internal?.handleCreateNewThread?.();
    if (thread) {
      apiRef.current?.openNewThread(thread);
    }
  };

  return (
    <slots.threadsList
      gap={2}
      height="100%"
      width="100%"
      {...slotProps.threadsList}
    >
      <NewChatButton openNewThread={openNewThread} />
      <Box mx={2} mb={0.5}>
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {locale.historyTitle}
        </slots.listSubtitle>
      </Box>
      <Box ref={ref} flex={1}>
        {!!height && (
          <Scrollbar style={{ minHeight: height - 1, maxHeight: height - 1 }}>
            <ThreadsListMapBlock />
          </Scrollbar>
        )}
      </Box>
    </slots.threadsList>
  );
}

export default ThreadsList;
