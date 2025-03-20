import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThreadModel } from '../../models/ThreadModel';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Threads } from '../../models/Threads';
import { useLocalizationContext } from '../core/LocalizationContext';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  // TODO #ANY
  model: Threads<any, any>;
  thread: ThreadModel;
};

const ThreadListItemMenu: React.FC<Props> = ({ anchorEl, handleClose, model, thread }) => {
  const { coreSlots } = useChatSlots();
  const { threadActions } = useChatContext();
  const locale = useLocalizationContext();

  const handleDelete = () => {
    handleClose();
    model.actions.deleteItem.value = thread;
  }

  return (
    <MdMenu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handleClose}
    >
      {threadActions?.map(({ disabled, startIcon, onClick, label }, index) => (
        <coreSlots.menuItem
          key={index}
          startIcon={startIcon}
          disabled={disabled}
          onClick={() => {
            handleClose();
            onClick(model, thread.data.data)
          }}
        >
          {label}
        </coreSlots.menuItem>
      ))}
      <coreSlots.menuItem
        startIcon={DeleteIcon}
        disabled={!thread.isOwner}
        onClick={handleDelete}
      >
        {locale.threadActionDelete}
      </coreSlots.menuItem>
    </MdMenu>
  );
}

export default ThreadListItemMenu;
