import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Dialogue } from '../../../models/dialogue/Dialogue';
import { ChatModel } from '../../../models/ChatModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import { lng } from '../../../utils/lng';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  chat: ChatModel;
};

const DialogueInfoPopup: React.FC<Props> = ({ chat }) => {
  const [dialogue, setDialogue] = React.useState<Dialogue | undefined>();
  const slots = useChatSlots();

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
        <slots.core.button
          onClick={handleClose}
        >
          {['Закрыть', 'Close']}
        </slots.core.button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogueInfoPopup;
