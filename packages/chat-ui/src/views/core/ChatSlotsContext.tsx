import * as React from 'react';
import { ChatSlotsType } from './useChatPropsSlots';

type ChatSlotsContextType = ChatSlotsType;

const Context = React.createContext<ChatSlotsContextType | undefined>(undefined);

const ChatSlotsProvider: React.FC<React.PropsWithChildren<{ props: ChatSlotsType }>> = ({ props, children }) => {
  const [value] = React.useState(props);
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useChatSlots = (): ChatSlotsContextType => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a ChatGlobalProvider");
  }

  return context;
};

const useChatCoreSlots = () => useChatSlots().core;

export { ChatSlotsProvider, useChatSlots, useChatCoreSlots };
