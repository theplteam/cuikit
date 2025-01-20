import * as React from 'react';
import { useChatModel } from '../ChatGlobalContext';
import { useObserverValue } from '../hooks/useObserverValue';
import MdBottomDriver from '../../ui/MdBottomDriver';

type Props = React.PropsWithChildren<{}>;

const ChatAppDriver: React.FC<Props> = ({ children }) => {
  const chat = useChatModel();
  const open = useObserverValue(chat.actions.menuDriverOpen) ?? false;

  return (
    <MdBottomDriver
      open={open}
      onClose={() => chat.actions.menuDriverOpen.value = false}
      title={['История', 'History']}
    >
      {children}
    </MdBottomDriver>
  );
};

export default ChatAppDriver;
