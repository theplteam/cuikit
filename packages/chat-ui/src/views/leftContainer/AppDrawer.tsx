import * as React from 'react';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDriver from '../../ui/MdBottomDriver';
import { useThreadListContext } from '../core/threadList/ThreadListContext';

type Props = React.PropsWithChildren;

const AppDrawer: React.FC<Props> = ({ children }) => {
  const { apiRef, locale } = useThreadListContext();
  const model = apiRef.current?._internal.model;
  const open = useObserverValue(model?.actions.menuDriverOpen) ?? false;

  console.log('model', model);

  const onClose = () => {
    if (model) {
      model.actions.menuDriverOpen.value = false
    }
  };

  return (
    <MdBottomDriver
      keepMounted
      open={open}
      title={locale.historyTitle}
      onClose={onClose}
    >
      {children}
    </MdBottomDriver>
  );
};

export default AppDrawer;
