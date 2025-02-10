import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogueLight } from '../../../models/Dialogue';
import { ChatModel } from '../../../models/ChatModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import { lng } from '../../../utils/lng';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  // TODO: #ANY
  chat: ChatModel<any, any>;
};

const DialogueInfoPopup: React.FC<Props> = ({ chat }) => {
  const [dialogue, setDialogue] = React.useState<DialogueLight | undefined>();
  const { slots, coreSlots } = useChatSlots();

  const viewItem = useObserverValue(chat.actions.viewItem);

  React.useEffect(() => {
    if (viewItem) setDialogue(viewItem);
  }, [viewItem]);

  const handleClose = () => {
    chat.actions.viewItem.value = undefined;
  }

  return (
    <Dialog
      maxWidth={'xs'}
      open={!!viewItem}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>
        {lng(['Информация', 'Info'])}
      </DialogTitle>
      <DialogContent>
        {!!dialogue && <slots.popupsInfoContent dialogue={dialogue} />}
      </DialogContent>
      <DialogActions>
        <coreSlots.button
          onClick={handleClose}
        >
          {['Закрыть', 'Close']}
        </coreSlots.button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogueInfoPopup;
