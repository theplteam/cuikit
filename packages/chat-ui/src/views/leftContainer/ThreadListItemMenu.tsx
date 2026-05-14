import * as React from 'react';
import { DeleteIcon, EditIcon, PushPinIcon } from '../../icons';
import MdMenu from '../../ui/menu/MdMenu';
import { Threads } from '../../models/Threads';
import { useObserverValue } from '../hooks/useObserverValue';
import { useHistoryContext } from '../core/history/HistoryContext';

type Props = {
  model: Threads<any, any>;
};

const ThreadListItemMenu: React.FC<Props> = ({ model }) => {
  const { slots, locale, threadActions, internal, enableDialogueRename, enableThreadPin, onPinThread } = useHistoryContext();
  const menuConfig = model.listGroups.menuConfig;
  const config = useObserverValue(menuConfig);
  const pinnedAt = useObserverValue(config?.thread?.pinnedAt);

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

  const handleRename = () => {
    handleClose();
    if (thread && internal) {
      internal.model.renameItem.value = thread.data;
    }
  };

  const handlePin = () => {
    handleClose();
    if (thread) {
      const nextPinnedAt = pinnedAt ? null : Date.now();
      thread.pinnedAt.value = nextPinnedAt;
      onPinThread?.(thread.id, nextPinnedAt);
      model.listGroups.audit(locale, model.list.value);
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
          <>
            {enableDialogueRename ? (
              <slots.baseMenuItem
                startIcon={EditIcon}
                onClick={handleRename}
              >
                {locale.threadActionRename}
              </slots.baseMenuItem>
            ) : null}
            {enableThreadPin ? (
              <slots.baseMenuItem
                startIcon={PushPinIcon}
                onClick={handlePin}
              >
                {pinnedAt ? locale.threadActionUnpin : locale.threadActionPin}
              </slots.baseMenuItem>
            ) : null}
            <slots.baseMenuItem
              startIcon={DeleteIcon}
              onClick={handleDelete}
            >
              {locale.threadActionDelete}
            </slots.baseMenuItem>
          </>
        )}
    </MdMenu>
  );
}

export default ThreadListItemMenu;
