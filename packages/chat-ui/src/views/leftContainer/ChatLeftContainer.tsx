import * as React from 'react';
import ChatDialoguesListBlock from './ChatDialoguesListBlock';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import NewChatButton from './NewChatButton';
import ContainerSubtitle from '../../ui/ContainerSubtitle';
import { ChatModel } from '../../models/ChatModel';
import useThrottledResizeObserver from '../hooks/useThrottledResizeObserver';
import Scrollbar from '../../ui/Scrollbar';

type Props = {
  chat: ChatModel;
};

const ChatLeftContainer: React.FC<Props> = ({chat}) => {
  const { ref, height } = useThrottledResizeObserver(1000);

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

export default ChatLeftContainer;
