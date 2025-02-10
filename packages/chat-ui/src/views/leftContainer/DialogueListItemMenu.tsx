import * as React from 'react';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DialogueLight } from '../../models/Dialogue';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Dialogues } from '../../models/stream/Dialogues';

type Props = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  // TODO #ANY
  model: Dialogues<any, any>;
  dialogue: DialogueLight;
};

const DialogueListItemMenu: React.FC<Props> = ({ anchorEl, handleClose, model, dialogue }) => {
  const { coreSlots } = useChatSlots();
  const handleDelete = () => {
    handleClose();
    model.actions.deleteItem.value = dialogue;
  }

  const handleShare = () => {
    handleClose();
    model.actions.shareItem.value = dialogue;
  }

  const handleOpenInfo = () => {
    handleClose();
    model.actions.viewItem.value = dialogue;
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
        startIcon={ShareIcon}
        onClick={handleShare}
        disabled={!dialogue.isOwner}
      >
        {['Поделиться', 'Share']}
      </coreSlots.menuItem>
      <coreSlots.menuItem
        startIcon={HelpOutlineIcon}
        onClick={handleOpenInfo}
      >
        {['Информация', 'Info']}
      </coreSlots.menuItem>
      <coreSlots.menuItem
        startIcon={DeleteIcon}
        onClick={handleDelete}
        disabled={!dialogue.isOwner}
      >
        {['Удалить', 'Delete']}
      </coreSlots.menuItem>
    </MdMenu>
  );
}

export default DialogueListItemMenu;
