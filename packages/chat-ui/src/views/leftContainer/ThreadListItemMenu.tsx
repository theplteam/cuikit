import * as React from 'react';
import { DeleteIcon } from '../../icons';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useLocalizationContext } from '../core/LocalizationContext';
import { useChatContext } from '../core/ChatGlobalContext';
import { Threads } from '../../models/Threads';
import { useObserverValue } from '../hooks/useObserverValue';

type Props = {
  model: Threads<any, any>;
};

const ThreadListItemMenu: React.FC<Props> = ({ model }) => {
  const menuConfig = model.listGroups.menuConfig;
  const config = useObserverValue(menuConfig);
  const { coreSlots } = useChatSlots();
  const { threadActions, apiRef } = useChatContext();
  const locale = useLocalizationContext();

  const anchorEl = config?.anchorEl;
  const thread = config?.thread;

  const handleClose = () => {
    if (menuConfig.value) {
      menuConfig.value = {
        anchorEl: null,
        thread: menuConfig.value.thread,
      };
    }
  }

  const handleDelete = () => {
    handleClose();
    if (thread) {
      apiRef.current?.setDeleteThreadItem(thread.data);
    }
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
      {(threadActions?.length && thread)
        ? threadActions.map((ActionComponent, index) => (
          <ActionComponent
            key={index}
            thread={thread.data}
            onClose={handleClose}
          />
        )) : (
          <coreSlots.menuItem
            startIcon={DeleteIcon}
            onClick={handleDelete}
          >
            {locale.threadActionDelete}
          </coreSlots.menuItem>
        )}
    </MdMenu>
  );
}

export default ThreadListItemMenu;
