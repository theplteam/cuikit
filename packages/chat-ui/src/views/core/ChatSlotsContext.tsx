import * as React from 'react';
import { CoreSlots, SlotsType } from './usePropsSlots';
import { DialogueAbstract } from '../../models/DialogueAbstract';
import { SlotPropsType } from './SlotPropsType';

type ChatSlotsContextType<D extends DialogueAbstract> = {
  slots: SlotsType<D>;
  coreSlots: CoreSlots;
  slotProps: Partial<SlotPropsType<D>>;
};

const Context = React.createContext<ChatSlotsContextType<any> | undefined>(undefined);

type ProviderProps<D extends DialogueAbstract> = React.PropsWithChildren<{
  slots: SlotsType<D>;
  coreSlots: CoreSlots;
  slotProps: Partial<SlotPropsType<D>>;
}>;

const ChatSlotsProvider = <D extends DialogueAbstract>({ slots, coreSlots, slotProps, children }: ProviderProps<D>) => {
  const [value] = React.useState({ slots, coreSlots, slotProps });
  return (
    <Context.Provider value={value as ChatSlotsContextType<D>}>
      {children}
    </Context.Provider>
  );
};

const useChatSlots = (): ChatSlotsContextType<DialogueAbstract> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useChatSlots must be used within a ChatSlotsProvider");
  }

  return context;
};

const useChatCoreSlots = () => useChatSlots().coreSlots;

export { ChatSlotsProvider, useChatSlots, useChatCoreSlots };
