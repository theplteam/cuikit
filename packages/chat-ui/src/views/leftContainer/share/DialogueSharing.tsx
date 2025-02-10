import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ChatModel } from '../../../models/ChatModel';
import { DialogueLight } from '../../../models/Dialogue';
import { useObserverValue } from '../../hooks/useObserverValue';
import { lng } from '../../../utils/lng';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { DDialogue, DMessage } from '../../../models';

type Props = {
  chat: ChatModel<DMessage, DDialogue>;
};

const DialogueSharing: React.FC<Props> = ({ chat }) => {
  const [dialogueEditable, setDialogue] = React.useState<DialogueLight | undefined>();
  const shareItem = useObserverValue(chat.actions.shareItem);
  const tariffsRef = React.useRef({ tariffs: [] });
  const { slots, coreSlots } = useChatSlots();
  const snackbar = useSnackbar();

  const handleClose = () => {
    chat.actions.shareItem.value = undefined;
  }

  const handleSave = async () => {
    handleClose();
    if (dialogueEditable) {
      // TODO: #ANY - Вообще не должно быть здесь этого
      const res = await chat.dialogueActions.edit?.({
        ...dialogueEditable.data.copyData(),
      } as any, dialogueEditable);

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
        <coreSlots.button
          onClick={handleClose}
        >
          {['Нет', 'No']}
        </coreSlots.button>
        <coreSlots.button
          onClick={handleSave}
          color={'primary'}
        >
          {['Применить', 'Apply']}
        </coreSlots.button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogueSharing;
