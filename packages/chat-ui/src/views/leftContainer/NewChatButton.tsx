import * as React from 'react';
import { AddIcon } from '../../icons';
import Box from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

type Props = {
  openNewThread: () => void;
};

const useDisabled = () => {
  const { apiRef } = useThreadListContext();
  const model = apiRef.current?._internal.model;
  const thread = useObserverValue(model?.currentThread);

  const isEmpty = useObserverValue(thread?.isEmpty) as boolean;
  return isEmpty;
}

export const NewChatIconButton: React.FC<Props> = ({ openNewThread }) => {
  const disabled = useDisabled();
  const { slots } = useThreadListContext();

  return (
    <slots.baseIconButton
      disabled={disabled}
      size="small"
      onClick={openNewThread}
    >
      <AddIcon />
    </slots.baseIconButton>
  );
};

const NewChatButton: React.FC<Props> = ({ openNewThread }) => {
  const disabled = useDisabled();
  const { slots, locale } = useThreadListContext();

  return (
    <Box
      pt={1.5}
      px={2}
      width="100%"
      boxSizing="border-box"
    >
      <slots.baseButton
        fullWidth
        disabled={disabled}
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={openNewThread}
      >
        {locale.newChat}
      </slots.baseButton>
    </Box>
  );
};

export default NewChatButton;
