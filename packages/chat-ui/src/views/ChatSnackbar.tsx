import * as React from 'react';
import { Snackbar } from '@mui/material';
import { useSnackbar, useSnackbarState } from './hooks/useSnackbar';

type Props = {};

const ChatSnackbar: React.FC<Props> = () => {
  const snackbar = useSnackbar();
  const open = useSnackbarState();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={snackbar.close}
      message={snackbar.title}
    />
  );
}

export default ChatSnackbar;
