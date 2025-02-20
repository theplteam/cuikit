import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ChatViewConstants } from '../ChatViewConstants';
import MessagesList from './MessagesList';
import { useDialogueContext } from '../DialogueContext';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {};

const ChatMessages: React.FC<Props> = () => {
  const { apiRef, dialogue } = useDialogueContext();

  const messages = useObserverValue(apiRef.current?.dialogue.getListener('branch'));

  return (
    <Stack
      gap={3}
      flex={1}
      alignItems={'flex-start'}
      maxWidth={'100%'}
      width={'100%'}
      id={ChatViewConstants.MESSAGE_BOX_ID}
    >
      {!!dialogue && <MessagesList dialogue={dialogue} messages={messages ?? []}/>}
    </Stack>
  );
};

export default React.memo(ChatMessages);
