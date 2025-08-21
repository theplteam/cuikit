import * as React from 'react';
import { AddIcon } from '../../icons';
import { useObserverValue } from '../hooks/useObserverValue';
import { useHistoryContext } from '../core/history/HistoryContext';
import internalApi from '../core/history/internalApi';

type Props = {
  openNewThread: () => void;
};

const useDisabled = () => {
  const internal = useObserverValue(internalApi);
  const thread = useObserverValue(internal?.model?.currentThread);

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
    <div>
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
    </div>
  );
};

export default NewChatButton;
