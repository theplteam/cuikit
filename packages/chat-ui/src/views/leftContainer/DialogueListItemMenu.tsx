import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialogue } from '../../models/Dialogue';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Dialogues } from '../../models/stream/Dialogues';
import { useLocalizationContext } from '../core/LocalizationContext';

type Props = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  // TODO #ANY
  model: Dialogues<any, any>;
  dialogue: Dialogue;
};

const DialogueListItemMenu: React.FC<Props> = ({ anchorEl, handleClose, model, dialogue }) => {
  const { coreSlots } = useChatSlots();
  const locale = useLocalizationContext();

  const handleDelete = () => {
    handleClose();
    model.actions.deleteItem.value = dialogue;
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
        disabled={!dialogue.isOwner}
      >
        {locale.dialogueActionDelete}
      </coreSlots.menuItem>
    </MdMenu>
  );
}

export default DialogueListItemMenu;
