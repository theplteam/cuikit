import * as React from 'react';
import Stack from '@mui/material/Stack';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import ChatDialoguesListBlock from './ChatDialoguesListBlock';
import { useChatModel } from '../ChatGlobalContext';
import useThrottledResizeObserver from '../hooks/useThrottledResizeObserver';
import ContainerSubtitle from '../../ui/ContainerSubtitle';
import Scrollbar from '../../ui/Scrollbar';

type Props = {};

const DialoguesList: React.FC<Props> = () => {
  const { ref, height } = useThrottledResizeObserver(1000);
  const chat = useChatModel();

  return (
    <Stack gap={2} height={'100%'}>
      <NewChatButton chat={chat} />
      <Box mx={2} mb={0.5}>
        <ContainerSubtitle>
          {['История', 'History']}
        </ContainerSubtitle>
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
