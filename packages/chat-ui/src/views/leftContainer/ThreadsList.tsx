import * as React from 'react';
import Stack from '@mui/material/Stack';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import ThreadsListBlock from './ThreadsListBlock';
import { useChatContext } from '../core/ChatGlobalContext';
import useThrottledResizeObserver from '../hooks/useThrottledResizeObserver';
import Scrollbar from '../../ui/Scrollbar';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useLocalizationContext } from '../core/LocalizationContext';

const ThreadsList: React.FC = () => {
  const { ref, height } = useThrottledResizeObserver(1000);
  const { handleCreateNewThread, apiRef } = useChatContext();
  const { slotProps, slots } = useChatSlots();
  const locale = useLocalizationContext();

  const openNewThread = () => {
    const thread = handleCreateNewThread?.();
    if (thread) {
      apiRef.current?.openNewThread(thread);
    }
  }

  return (
    <Stack gap={2} height="100%">
      <NewChatButton openNewThread={openNewThread} />
      <Box mx={2} mb={0.5}>
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {locale.historyTitle}
        </slots.listSubtitle>
      </Box>
      <Box ref={ref} flex={1}>
        {!!height && (
          <Scrollbar style={{ minHeight: height -1, maxHeight: height -1 }}>
            <ThreadsListBlock />
          </Scrollbar>
        )}
      </Box>
    </Stack>
  );
}

export default ThreadsList;
