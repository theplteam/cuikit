import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useObserverValue } from '../hooks/useObserverValue';
import { useSnackbar } from '../hooks/useSnackbar';
import Typography from '@mui/material/Typography';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

const ThreadDeleteConfirm: React.FC = () => {
  const { apiRef, slots, slotProps, locale } = useThreadListContext();
  const internal = apiRef.current?._internal;
  const deleteItem = useObserverValue(internal?.model.actions.deleteItem);
  const snackbar = useSnackbar();

  const handleClose = () => {
    apiRef.current?.setDeleteThreadItem(undefined);
  }

  const handleDelete = () => {
    if (deleteItem) {
      internal?.model.delete(deleteItem.id);
      internal?.onThreadDeleted?.({ thread: deleteItem });
      snackbar.show(locale.threadDeletedSuccess);
    }
    handleClose();
  }

  return (
    <Dialog
      maxWidth="sm"
      open={!!deleteItem}
      onClose={handleClose}
    >
      <DialogTitle>
        {locale.threadDeleteTitle}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {locale.threadDeleteContent}
        </Typography>
      </DialogContent>
      <DialogActions>
        <slots.baseButton
          onClick={handleClose}
          {...slotProps.baseButton}
        >
          {locale.no}
        </slots.baseButton>
        <slots.baseButton
          color="primary"
          onClick={handleDelete}
          {...slotProps.baseButton}
        >
          {locale.yes}
        </slots.baseButton>
      </DialogActions>
    </Dialog>
  );
};

export default ThreadDeleteConfirm;
