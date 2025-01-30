import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ChatModel } from '../../../models/ChatModel';
import { Dialogue } from '../../../models/Dialogue';
import { useObserverValue } from '../../hooks/useObserverValue';
import { lng } from '../../../utils/lng';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  chat: ChatModel;
};

const DialogueSharing: React.FC<Props> = ({ chat }) => {
  const [dialogueEditable, setDialogue] = React.useState<Dialogue | undefined>();
  const shareItem = useObserverValue(chat.actions.shareItem);
  const tariffsRef = React.useRef({ tariffs: [] });
  const slots = useChatSlots();
  const snackbar = useSnackbar();

  const handleClose = () => {
    chat.actions.shareItem.value = undefined;
  }

  const handleSave = async () => {
    handleClose();
    if (dialogueEditable) {
      const res = await dialogueEditable.options.edit?.({
        ...dialogueEditable.data.copyData(),
        messages: [],
      }, dialogueEditable);

      if (res.success) {
        snackbar.show(['Вы поделились диалогом', 'You successfully shared the dialogue'])
      }
    }

  }

  React.useEffect(() => {
    if (!!shareItem) {
      setDialogue(shareItem);
    }
  }, [shareItem])

  return (
    <Dialog
      maxWidth={'sm'}
      open={!!shareItem}
      onClose={handleClose}
    >
      <DialogTitle>
        {lng(['Поделиться', 'Share'])}
      </DialogTitle>
      <DialogContent>
        {!!dialogueEditable && (
          <slots.popupsSharingContent
            dialogue={dialogueEditable}
            tariffsRef={tariffsRef}
          />
        )}
      </DialogContent>
      <DialogActions>
        <slots.core.button
          onClick={handleClose}
        >
          {['Нет', 'No']}
        </slots.core.button>
        <slots.core.button
          onClick={handleSave}
          color={'primary'}
        >
          {['Применить', 'Apply']}
        </slots.core.button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogueSharing;
