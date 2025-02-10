import * as React from 'react';
import { useChatModel } from '../core/ChatGlobalContext';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDriver from '../../ui/MdBottomDriver';

type Props = React.PropsWithChildren;

const MobileImageAppDriver: React.FC<Props> = ({ children }) => {
  const chat = useChatModel();
  const open = useObserverValue(chat.actions.mobileImageDriverOpen) ?? false;

  return (
    <MdBottomDriver
      open={open}
      onClose={() => chat.actions.mobileImageDriverOpen.value = false}
      title={['Выберите действие', 'Choose action']}
      keepMounted
    >
      {children}
    </MdBottomDriver>
  );
};

export default MobileImageAppDriver;
