import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { ArrayType } from '../../models/types';
import { ChatModel } from '../../models/ChatModel';
import { ChatDialogue } from '../../models/ChatDialogue';

type ChatGlobalContextType = {
  model: ChatModel<ChatDialogue>;
  slots: ChatPropsTypes['slots'];
  dialogue: ChatDialogue | undefined;
  dialogues: ArrayType<ChatDialogue>;
  setDialogue: (dialogue: ChatDialogue) => void;
  loading: boolean;
  actionsAssistant: { element: Exclude<ChatPropsTypes['assistantActions'], undefined>[number] }[];
};

const Context = React.createContext<ChatGlobalContextType | undefined>(undefined);

const ChatGlobalProvider: React.FC<React.PropsWithChildren<{ props: ChatPropsTypes }>> = ({ props, children }) => {
  const model = React.useMemo(() => {
    return props.model ?? (new ChatModel(props.modelProps)).init();
  }, [props.model, props.modelProps]);

  /*React.useEffect(() => {
    model.dialoguesList.array.value = props.dialogues.concat();
  }, [props.dialogues]);*/

  const value: ChatGlobalContextType = React.useMemo(() => ({
    model,
    dialogue: props.dialogue,
    dialogues: props.dialogues,
    setDialogue: props.setDialogue,
    slots: props.slots,
    loading: props.loading,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
  }), [model, props.slots, props.loading, props.dialogue, props.dialogues]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useChatContext = (): ChatGlobalContextType => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a ChatGlobalProvider");
  }

  return context;
};

const useChatModel = () => useChatContext().model;
const useChatSlots = () => useChatContext().slots;
const useChatCoreSlots = () => useChatContext().slots.core;

export { ChatGlobalProvider, useChatContext, useChatModel, useChatSlots, useChatCoreSlots };
