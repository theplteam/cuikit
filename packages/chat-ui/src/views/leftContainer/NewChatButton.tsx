import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useChatContext } from '../ChatGlobalContext';
import { ChatModel } from '../../models/ChatModel';
import { useObserverValue } from '../hooks/useObserverValue';
import MdIconButton from '../../ui/MdIconButton';
import MdButton from '../../ui/MdButton';
import { ChatDialogue } from '../../models/ChatDialogue';

type Props<D extends ChatDialogue> = {
  chat: ChatModel<D>;
};

const useDisabled = () => {
  const { dialogue } = useChatContext();
  const isEmpty = useObserverValue(dialogue.isEmpty) as boolean;
  return (isEmpty && !dialogue.data.filters);
}

export const NewChatIconButton = <D extends ChatDialogue>({ chat }: Props<D>) => {
  const disabled = useDisabled();
  return (
    <MdIconButton
      disabled={disabled}
      onClick={chat.openNew}
      size={'small'}
    >
      <AddIcon />
    </MdIconButton>
  );
};

const NewChatButton = <D extends ChatDialogue>({ chat }: Props<D>) => {
  const disabled = useDisabled();
  return (
    <Box
      pt={1.5}
      px={2}
      width={'100%'}
      boxSizing={'border-box'}
    >
      <MdButton
        disabled={disabled}
        onClick={chat.openNew}
        startIcon={<AddIcon />}
        fullWidth
        variant={'outlined'}
      >
        {['Новый чат', 'New chat']}
      </MdButton>
    </Box>
  );
};

export default NewChatButton;
