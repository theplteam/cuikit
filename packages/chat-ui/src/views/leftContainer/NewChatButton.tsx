import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useChatContext } from '../core/ChatGlobalContext';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { ChatModel } from '../../models/ChatModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { Dialogue } from 'models/Dialogue';

type Props<D extends Dialogue> = {
  chat: ChatModel<D>;
};

const useDisabled = () => {
  const { dialogue } = useChatContext();
  const isEmpty = useObserverValue(dialogue?.isEmpty) as boolean;
  return isEmpty;
}

export const NewChatIconButton = <D extends Dialogue>({ chat }: Props<D>) => {
  const disabled = useDisabled();
  const coreSlots = useChatCoreSlots();
  return (
    <coreSlots.iconButton
      disabled={disabled}
      onClick={chat.openNew}
      size={'small'}
    >
      <AddIcon />
    </coreSlots.iconButton>
  );
};

const NewChatButton = <D extends Dialogue>({ chat }: Props<D>) => {
  const disabled = useDisabled();
  const coreSlots = useChatCoreSlots();
  return (
    <Box
      pt={1.5}
      px={2}
      width={'100%'}
      boxSizing={'border-box'}
    >
      <coreSlots.button
        disabled={disabled}
        onClick={chat.openNew}
        startIcon={<AddIcon />}
        fullWidth
        variant={'outlined'}
      >
        {['Новый чат', 'New chat']}
      </coreSlots.button>
    </Box>
  );
};

export default NewChatButton;
