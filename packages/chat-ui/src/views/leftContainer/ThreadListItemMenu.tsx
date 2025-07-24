import * as React from 'react';
import { DeleteIcon } from '../../icons';
import MdMenu from '../../ui/menu/MdMenu';
import { Threads } from '../../models/Threads';
import { useObserverValue } from '../hooks/useObserverValue';
import { useHistoryContext } from '../core/history/HistoryContext';

type Props = {
  model: Threads<any, any>;
};

const ThreadListItemMenu: React.FC<Props> = ({ model }) => {
  const { slots, locale, threadActions, internal } = useHistoryContext();
  const menuConfig = model.listGroups.menuConfig;
  const config = useObserverValue(menuConfig);

  const anchorEl = config?.anchorEl;
  const thread = config?.thread;

  const handleClose = () => {
    if (menuConfig.value) {
      menuConfig.value = {
        anchorEl: null,
        thread: menuConfig.value.thread,
      };
    }
  };

  const handleDelete = () => {
    handleClose();
    if (thread && internal) {
      internal.model.deleteItem.value = thread.data;
    }
  };

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
      {(threadActions?.length && thread)
        ? threadActions.map((ActionComponent, index) => (
          <ActionComponent
            key={index}
            thread={thread.data}
            onClose={handleClose}
          />
        )) : (
          <slots.baseMenuItem
            startIcon={DeleteIcon}
            onClick={handleDelete}
          >
            {locale.threadActionDelete}
          </slots.baseMenuItem>
        )}
    </MdMenu>
  );
}

export default ThreadListItemMenu;
