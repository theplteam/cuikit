import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThreadModel } from '../../models/ThreadModel';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Threads } from '../../models/Threads';
import { useLocalizationContext } from '../core/LocalizationContext';

type Props = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  // TODO #ANY
  model: Threads<any, any>;
  thread: ThreadModel;
};

const DialogueListItemMenu: React.FC<Props> = ({ anchorEl, handleClose, model, thread }) => {
  const { coreSlots } = useChatSlots();
  const locale = useLocalizationContext();

  const handleDelete = () => {
    handleClose();
    model.actions.deleteItem.value = thread;
  }

  return (
    <MdMenu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <coreSlots.menuItem
        startIcon={DeleteIcon}
        onClick={handleDelete}
        disabled={!thread.isOwner}
      >
        {locale.threadActionDelete}
      </coreSlots.menuItem>
    </MdMenu>
  );
}

export default DialogueListItemMenu;
