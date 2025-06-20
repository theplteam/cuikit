import * as React from 'react';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDriver from '../../ui/MdBottomDriver';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

type Props = React.PropsWithChildren;

const AppDrawer: React.FC<Props> = ({ children }) => {
  const { locale, threadListModel } = useThreadListContext();
  const open = useObserverValue(threadListModel.menuDriverOpen) ?? false;

  const onClose = () => {
    if (threadListModel) {
      threadListModel.menuDriverOpen.value = false
    }
  };

  return (
    <MdBottomDriver
      keepMounted
      open={!!open}
      title={locale.historyTitle}
      onClose={onClose}
    >
      {children}
    </MdBottomDriver>
  );
};

export default AppDrawer;
