import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThreadModel } from '../../models/ThreadModel';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useLocalizationContext } from '../core/LocalizationContext';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  thread: ThreadModel;
};

const ThreadListItemMenu: React.FC<Props> = ({ anchorEl, handleClose, thread }) => {
  const { coreSlots } = useChatSlots();
  const { threadActions, apiRef } = useChatContext();
  const locale = useLocalizationContext();

  const handleDelete = () => {
    handleClose();
    apiRef.current?.setDeleteThreadItem(thread.data.data);
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
      {threadActions?.length
        ? threadActions.map((ActionComponent, index) => (
          <ActionComponent
            key={index}
            thread={thread.data.data}
            onClose={handleClose}
          />
        )) : (
          <coreSlots.menuItem
            startIcon={DeleteIcon}
            disabled={!thread.isOwner}
            onClick={handleDelete}
          >
            {locale.threadActionDelete}
          </coreSlots.menuItem>
        )}
    </MdMenu>
  );
}

export default ThreadListItemMenu;
