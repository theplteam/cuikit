import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useObserverValue } from '../hooks/useObserverValue';
import { useHistoryContext } from '../core/history/HistoryContext';

const ThreadRenameDialog: React.FC = () => {
  const { slots, slotProps, locale, internal, apiRef } = useHistoryContext();
  const renameItem = useObserverValue(internal?.model.renameItem);
  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
    if (renameItem) {
      setTitle(renameItem.title);
    }
  }, [renameItem?.id]);

  const handleClose = () => {
    if (internal) {
      internal.model.renameItem.value = undefined;
    }
  };

  const handleSave = () => {
    const newTitle = title.trim();
    if (renameItem && newTitle && newTitle !== renameItem.title) {
      const oldTitle = renameItem.title;
      internal?.model.rename(renameItem.id, newTitle);
      apiRef.current?.onThreadRenamed?.({ thread: renameItem, oldTitle, newTitle });
    }
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!renameItem}
      onClose={handleClose}
    >
      <DialogTitle>
        {locale.threadRenameTitle}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label={locale.threadRenameLabel}
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <slots.baseButton
          onClick={handleClose}
          {...slotProps.baseButton}
        >
          {locale.cancel}
        </slots.baseButton>
        <slots.baseButton
          color="primary"
          onClick={handleSave}
          {...slotProps.baseButton}
        >
          {locale.save}
        </slots.baseButton>
      </DialogActions>
    </Dialog>
  );
};

export default ThreadRenameDialog;
