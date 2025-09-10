import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import { SlotPropsType } from './SlotPropsType';
import { Thread, Message } from '../../models';

type ChatSlotsContextType<DM extends Message, DD extends Thread<DM>> = {
  slots: SlotsType<DM, DD>;
  coreSlots: CoreSlots;
  slotProps: Partial<SlotPropsType<DM, DD>>;
};

const Context = React.createContext<ChatSlotsContextType<any, any> | undefined>(undefined);

type ProviderProps<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  slots: Partial<SlotsType<DM, DD>>;
  coreSlots?: Partial<CoreSlots>;
  slotProps: Partial<SlotPropsType<DM, DD>>;
}>;

const ChatSlotsProvider = <DM extends Message, DD extends Thread<DM>>({ slots, coreSlots, slotProps, children }: ProviderProps<DM, DD>) => {
  const [value] = React.useState({ slots, coreSlots, slotProps });
  return (
    <Context.Provider value={value as ChatSlotsContextType<DM, DD>}>
      {children}
    </Context.Provider>
  );
};

const useChatSlots = <DM extends Message, DD extends Thread<DM>>(): ChatSlotsContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useChatSlots must be used within a ChatSlotsProvider");
  }

  return context;
};

const useChatCoreSlots = () => useChatSlots().coreSlots;

export { ChatSlotsProvider, useChatSlots, useChatCoreSlots };
