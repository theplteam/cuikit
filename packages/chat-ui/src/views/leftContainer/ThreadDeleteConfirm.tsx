import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useObserverValue } from '../hooks/useObserverValue';
import Typography from '@mui/material/Typography';
import { useHistoryContext } from '../core/history/HistoryContext';

const ThreadDeleteConfirm: React.FC = () => {
  const { slots, slotProps, locale, internal, apiRef } = useHistoryContext();
  const deleteItem = useObserverValue(internal?.model.deleteItem);

  const handleClose = () => {
    if (internal) {
      internal.model.deleteItem.value = undefined;
    }
  };

  const handleDelete = () => {
    if (deleteItem) {
      internal?.model.delete(deleteItem.id);
      apiRef.current?.onThreadDeleted?.({ thread: deleteItem });
    }
    handleClose();
  };

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
