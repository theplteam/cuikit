import * as React from 'react';
import Stack from '@mui/material/Stack';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import ChatDialoguesListBlock from './ChatDialoguesListBlock';
import { useChatModel } from '../core/ChatGlobalContext';
import useThrottledResizeObserver from '../hooks/useThrottledResizeObserver';
import Scrollbar from '../../ui/Scrollbar';
import { useChatSlots } from '../core/ChatSlotsContext';

type Props = {};

const DialoguesList: React.FC<Props> = () => {
  const { ref, height } = useThrottledResizeObserver(1000);
  const chat = useChatModel();
  const { slotProps, slots } = useChatSlots();

  return (
    <Stack gap={2} height={'100%'}>
      <NewChatButton chat={chat} />
      <Box mx={2} mb={0.5}>
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {['История', 'History']}
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
