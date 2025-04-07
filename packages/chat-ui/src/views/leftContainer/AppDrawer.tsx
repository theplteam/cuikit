import * as React from 'react';
import { useChatModel } from '../core/ChatGlobalContext';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDriver from '../../ui/MdBottomDriver';
import { useLocalizationContext } from '../core/LocalizationContext';

type Props = React.PropsWithChildren;

const AppDrawer: React.FC<Props> = ({ children }) => {
  const chat = useChatModel();
  const open = useObserverValue(chat.actions.menuDriverOpen) ?? false;

  const locale = useLocalizationContext();

  return (
    <MdBottomDriver
      keepMounted
      open={open}
      title={locale.historyTitle}
      onClose={() => chat.actions.menuDriverOpen.value = false}
    >
      {children}
    </MdBottomDriver>
  );
};

export default AppDrawer;
