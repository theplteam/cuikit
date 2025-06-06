import * as React from 'react';
import { Snackbar } from '@mui/material';
import { useObserverValue } from './hooks/useObserverValue';
import { useChatContext } from './core/ChatGlobalContext';

const ChatSnackbar: React.FC = () => {
  const { snackbar } = useChatContext();
  const open = useObserverValue(snackbar.open);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      message={snackbar.title}
      onClose={snackbar.close}
    />
  );
}

export default ChatSnackbar;
