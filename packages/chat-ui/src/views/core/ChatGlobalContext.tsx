import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { ArrayType } from '../../models/types';
import { ChatModel } from '../../models/ChatModel';
import { Dialogue } from 'models/Dialogue';
import { DDialogue } from '../../models/DialogueData';

type ChatGlobalContextType<Data extends DDialogue = DDialogue> = {
  model: ChatModel<Data>;
  dialogue: Dialogue<Data> | undefined;
  dialogues: ArrayType<Dialogue<Data>>;
  setDialogue: (dialogue: Dialogue<Data>) => void;
  loading: boolean;
  actionsAssistant: { element: Exclude<ChatPropsTypes<Data>['assistantActions'], undefined>[number] }[];
};

const Context = React.createContext<ChatGlobalContextType | undefined>(undefined);

type ProviderProps<Data extends DDialogue> = React.PropsWithChildren<{ props: ChatPropsTypes<Data> }>;

const ChatGlobalProvider = <Data extends DDialogue>({ props, children }: ProviderProps<Data>) => {
  const model = React.useMemo(() => {
    return props.model ?? (new ChatModel(props.modelProps)).init();
  }, [props.model, props.modelProps]);

  /*React.useEffect(() => {
    model.dialoguesList.array.value = props.dialogues.concat();
  }, [props.dialogues]);*/

  const value: ChatGlobalContextType<Data> = React.useMemo(() => ({
    model,
    dialogue: props.dialogue,
    dialogues: props.dialogues,
    setDialogue: props.setDialogue,
    loading: props.loading,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
  }), [model, props.loading, props.dialogue, props.dialogues]);

  return (
    // TODO: придумать как передать дженерик в контекст
    <Context.Provider value={value as any}>
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

export { ChatGlobalProvider, useChatContext, useChatModel };
