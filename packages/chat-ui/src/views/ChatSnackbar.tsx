import * as React from 'react';
import { Snackbar } from '@mui/material';
import { useSnackbar, useSnackbarState } from './hooks/useSnackbar';

const ChatSnackbar: React.FC = () => {
  const snackbar = useSnackbar();
  const open = useSnackbarState();

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
