import * as React from 'react';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDrawer from '../../ui/MdBottomDrawer';
import { useHistoryContext } from '../core/history/HistoryContext';

type Props = React.PropsWithChildren;

const AppDrawer: React.FC<Props> = ({ children }) => {
  const { locale, internal } = useHistoryContext();
  const open = useObserverValue(internal?.model.menuDrawerOpen) ?? false;

  const onClose = () => {
    if (internal) {
      internal.model.menuDrawerOpen.value = false
    }
  };

  return (
    <MdBottomDrawer
      keepMounted
      open={!!open}
      title={locale.historyTitle}
      onClose={onClose}
    >
      {children}
    </MdBottomDrawer>
  );
};

export default AppDrawer;
