import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ChatViewConstants } from '../ChatViewConstants';
import MessagesList from './MessagesList';
import { useThreadContext } from '../thread/ThreadContext';
import { useObserverValue } from '../hooks/useObserverValue';

const MessagesComponent: React.FC = () => {
  const { apiRef, thread } = useThreadContext();

  const messages = useObserverValue(apiRef.current?.getListener('branch'));
  const gap = 4;

  return (
    <Stack
      gap={gap}
      flex={1}
      alignItems="flex-start"
      maxWidth="100%"
      width="100%"
      id={ChatViewConstants.MESSAGE_BOX_ID}
    >
      {!!thread && <MessagesList thread={thread} messages={messages ?? []} gap={gap} />}
    </Stack>
  );
};

export default React.memo(MessagesComponent);
