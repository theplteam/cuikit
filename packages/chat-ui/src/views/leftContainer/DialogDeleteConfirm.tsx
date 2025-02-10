import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useObserverValue } from '../hooks/useObserverValue';
import { lng } from '../../utils/lng';
import { useSnackbar } from '../hooks/useSnackbar';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import Typography from '@mui/material/Typography';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {};

const DialogDeleteConfirm: React.FC<Props> = () => {
  const { model, onDialogueDeleted } = useChatContext();
  const deleteItem = useObserverValue(model.actions.deleteItem);
  const coreSlots = useChatCoreSlots();
  const snackbar = useSnackbar();

  const handleClose = () => {
    model.actions.deleteItem.value = undefined;
  }

  const handleDelete = () => {
    if (deleteItem) {
      model.delete(deleteItem.id);
      onDialogueDeleted?.({ dialogue: deleteItem['data']['data'] });
      snackbar.show(['Диалог удален', 'Dialogue successfully deleted']);
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
        {lng(['Подтверждение', 'Confirm'])}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {['Вы уверены, что хотите диалог?', 'Are you sure you want to delete dialogue?']}
        </Typography>
      </DialogContent>
      <DialogActions>
        <coreSlots.button
          onClick={handleClose}
        >
          {['Нет', 'No']}
        </coreSlots.button>
        <coreSlots.button
          onClick={handleDelete}
          color={'primary'}
        >
          {['Да', 'Yes']}
        </coreSlots.button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteConfirm;
