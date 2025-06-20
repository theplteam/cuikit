import * as React from 'react';
import { AddIcon } from '../../icons';
import Box from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { useHistoryContext } from '../core/history/HistoryContext';

type Props = {
  openNewThread: () => void;
};

const useDisabled = () => {
  const { apiRef } = useHistoryContext();
  const model = apiRef.current?._internal.model;
  const thread = useObserverValue(model?.currentThread);

  const isEmpty = useObserverValue(thread?.isEmpty) as boolean;
  return isEmpty;
}

export const NewChatIconButton: React.FC<Props> = ({ openNewThread }) => {
  const disabled = useDisabled();
  const { slots, slotProps } = useHistoryContext();

  return (
    <slots.baseIconButton
      disabled={disabled}
      size="small"
      onClick={openNewThread}
      {...slotProps.baseIconButton}
    >
      <AddIcon />
    </slots.baseIconButton>
  );
};

const NewChatButton: React.FC<Props> = ({ openNewThread }) => {
  const disabled = useDisabled();
  const { slots, slotProps, locale } = useHistoryContext();

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
        {...slotProps.baseButton}
      >
        {locale.newChat}
      </slots.baseButton>
    </Box>
  );
};

export default NewChatButton;
