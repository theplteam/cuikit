import * as React from 'react';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDriver from '../../ui/MdBottomDriver';
import { useHistoryContext } from '../core/history/HistoryContext';

type Props = React.PropsWithChildren;

const AppDrawer: React.FC<Props> = ({ children }) => {
  const { locale, historyModel } = useHistoryContext();
  const open = useObserverValue(historyModel.menuDriverOpen) ?? false;

  const onClose = () => {
    if (historyModel) {
      historyModel.menuDriverOpen.value = false
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
