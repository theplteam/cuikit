import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useChatContext } from '../core/ChatGlobalContext';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useObserverValue } from '../hooks/useObserverValue';
import { useLocalizationContext } from '../core/LocalizationContext';

type Props = {
  openNewDialogue: () => void;
};

const useDisabled = () => {
  const { dialogue } = useChatContext();
  const isEmpty = useObserverValue(dialogue?.isEmpty) as boolean;
  return isEmpty;
}

export const NewChatIconButton: React.FC<Props> = ({ openNewDialogue }) => {
  const disabled = useDisabled();
  const coreSlots = useChatCoreSlots();
  return (
    <coreSlots.iconButton
      disabled={disabled}
      onClick={openNewDialogue}
      size={'small'}
    >
      <AddIcon />
    </coreSlots.iconButton>
  );
};

const NewChatButton: React.FC<Props> = ({ openNewDialogue }) => {
  const disabled = useDisabled();
  const coreSlots = useChatCoreSlots();
  const locale = useLocalizationContext();

  return (
    <Box
      pt={1.5}
      px={2}
      width={'100%'}
      boxSizing={'border-box'}
    >
      <coreSlots.button
        disabled={disabled}
        onClick={openNewDialogue}
        startIcon={<AddIcon />}
        fullWidth
        variant={'outlined'}
      >
        {locale.newChat}
      </coreSlots.button>
    </Box>
  );
};

export default NewChatButton;
