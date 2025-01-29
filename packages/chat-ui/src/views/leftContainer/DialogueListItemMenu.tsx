import * as React from 'react';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ChatModel } from '../../models/ChatModel';
import { Dialogue } from 'models/Dialogue';
import MdMenu from '../../ui/menu/MdMenu';
import MdMenuItem from '../../ui/menu/MdMenuItem';

type Props = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  chat: ChatModel;
  dialogue: Dialogue;
};

const DialogueListItemMenu: React.FC<Props> = ({ anchorEl, handleClose, chat, dialogue }) => {
  const handleDelete = () => {
    handleClose();
    chat.actions.deleteItem.value = dialogue;
  }

  const handleShare = () => {
    handleClose();
    chat.actions.shareItem.value = dialogue;
  }

  const handleOpenInfo = () => {
    handleClose();
    chat.actions.viewItem.value = dialogue;
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
      <MdMenuItem
        startIcon={ShareIcon}
        onClick={handleShare}
        disabled={!dialogue.isOwner}
      >
        {['Поделиться', 'Share']}
      </MdMenuItem>
      <MdMenuItem
        startIcon={HelpOutlineIcon}
        onClick={handleOpenInfo}
      >
        {['Информация', 'Info']}
      </MdMenuItem>
      <MdMenuItem
        startIcon={DeleteIcon}
        onClick={handleDelete}
        disabled={!dialogue.isOwner}
      >
        {['Удалить', 'Delete']}
      </MdMenuItem>
    </MdMenu>
  );
}

export default DialogueListItemMenu;
