import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useObserverValue } from '../hooks/useObserverValue';
import { useSnackbar } from '../hooks/useSnackbar';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import Typography from '@mui/material/Typography';
import { useChatContext } from '../core/ChatGlobalContext';
import { useLocalizationContext } from '../core/LocalizationContext';

const ThreadDeleteConfirm: React.FC = () => {
  const { model, onThreadDeleted, apiRef } = useChatContext();
  const deleteItem = useObserverValue(model.actions.deleteItem);
  const coreSlots = useChatCoreSlots();
  const snackbar = useSnackbar();
  const locale = useLocalizationContext();

  const handleClose = () => {
    apiRef.current?.setDeleteThreadItem(undefined);
  }

  const handleDelete = () => {
    if (deleteItem) {
      model.delete(deleteItem.id);
      onThreadDeleted?.({ thread: deleteItem });
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
        <coreSlots.button
          onClick={handleClose}
        >
          {locale.no}
        </coreSlots.button>
        <coreSlots.button
          color="primary"
          onClick={handleDelete}
        >
          {locale.yes}
        </coreSlots.button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreadDeleteConfirm;
