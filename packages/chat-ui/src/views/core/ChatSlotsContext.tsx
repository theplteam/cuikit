import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';

type ChatSlotsContextType = ChatPropsTypes['slots'];

const Context = React.createContext<ChatSlotsContextType | undefined>(undefined);

const ChatSlotsProvider: React.FC<React.PropsWithChildren<{ props: ChatPropsTypes['slots'] }>> = ({ props, children }) => {
  return (
    <Context.Provider value={props}>
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
