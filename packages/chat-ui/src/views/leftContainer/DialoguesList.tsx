import * as React from 'react';
import Stack from '@mui/material/Stack';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import ChatDialoguesListBlock from './ChatDialoguesListBlock';
import { useChatContext } from '../core/ChatGlobalContext';
import useThrottledResizeObserver from '../hooks/useThrottledResizeObserver';
import Scrollbar from '../../ui/Scrollbar';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useLocalizationContext } from '../core/LocalizationContext';

type Props = {};

const DialoguesList: React.FC<Props> = () => {
  const { ref, height } = useThrottledResizeObserver(1000);
  const { handleCreateNewThread, apiRef } = useChatContext();
  const { slotProps, slots } = useChatSlots();
  const locale = useLocalizationContext();

  const openNewThread = () => {
    const dialogue = handleCreateNewThread?.();
    if (dialogue) {
      apiRef.current?.openNewThread(dialogue);
    }
  }

  return (
    <Stack gap={2} height={'100%'}>
      <NewChatButton openNewThread={openNewThread} />
      <Box mx={2} mb={0.5}>
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {locale.historyTitle}
        </slots.listSubtitle>
      </Box>
      <Box flex={1} ref={ref}>
        {!!height && (
          <Scrollbar style={{ minHeight: height -1, maxHeight: height -1 }}>
            <ChatDialoguesListBlock />
          </Scrollbar>
        )}
      </Box>
    </Stack>
  );
}

export default DialoguesList;
