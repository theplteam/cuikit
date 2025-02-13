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

type Props = {};

const DialogDeleteConfirm: React.FC<Props> = () => {
  const { model, onDialogueDeleted } = useChatContext();
  const deleteItem = useObserverValue(model.actions.deleteItem);
  const coreSlots = useChatCoreSlots();
  const snackbar = useSnackbar();
  const locale = useLocalizationContext();

  const handleClose = () => {
    model.actions.deleteItem.value = undefined;
  }

  const handleDelete = () => {
    if (deleteItem) {
      model.delete(deleteItem.id);
      onDialogueDeleted?.({ dialogue: deleteItem['data']['data'] });
      snackbar.show(locale.dialogueDeletedSuccess);
    }
    handleClose();
  }

  return (
    <Dialog
      maxWidth={'sm'}
      open={!!deleteItem}
      onClose={handleClose}
    >
      <DialogTitle>
        {locale.dialogueDeleteTitle}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {locale.dialogueDeleteContent}
        </Typography>
      </DialogContent>
      <DialogActions>
        <coreSlots.button
          onClick={handleClose}
        >
          {locale.no}
        </coreSlots.button>
        <coreSlots.button
          onClick={handleDelete}
          color={'primary'}
        >
          {locale.yes}
        </coreSlots.button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteConfirm;
