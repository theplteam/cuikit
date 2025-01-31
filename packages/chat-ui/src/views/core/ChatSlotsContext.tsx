import * as React from 'react';
import { ChatSlotsType } from './useChatPropsSlots';
import { Dialogue } from '../../models/dialogue/Dialogue';

type ChatSlotsContextType = ChatSlotsType<Dialogue>;

const Context = React.createContext<ChatSlotsContextType | undefined>(undefined);

type ProviderProps<D extends Dialogue> = React.PropsWithChildren<{ props: ChatSlotsType<D> }>;

const ChatSlotsProvider = <D extends Dialogue>({ props, children }: ProviderProps<D>) => {
  const [value] = React.useState(props);
  return (
    <Context.Provider value={value as ChatSlotsContextType}>
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
