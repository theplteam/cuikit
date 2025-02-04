import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { ArrayType } from '../../models/types';
import { ChatModel } from '../../models/ChatModel';
import { Dialogue } from '../../models/Dialogue';

type ChatGlobalContextType<D extends Dialogue> = {
  model: ChatModel<D>;
  dialogue: D | undefined;
  dialogues: ArrayType<D>;
  setDialogue: (dialogue: D) => void;
  loading: boolean;
  actionsAssistant: { element: Exclude<ChatPropsTypes<D>['assistantActions'], undefined>[number] }[];
  proccessAssistantText: ChatPropsTypes<D>['proccessAssistantText'];
};

const Context = React.createContext<ChatGlobalContextType<Dialogue> | undefined>(undefined);

type ProviderProps<D extends Dialogue> = React.PropsWithChildren<{ props: ChatPropsTypes<D> }>;

const ChatGlobalProvider = <D extends Dialogue>({ props, children }: ProviderProps<D>) => {
  const model = React.useMemo(() => {
    return props.model ?? (new ChatModel(props.modelProps)).init();
  }, [props.model, props.modelProps]);

  /*React.useEffect(() => {
    model.dialoguesList.array.value = props.dialogues.concat();
  }, [props.dialogues]);*/

  const value: ChatGlobalContextType<D> = React.useMemo(() => ({
    model,
    dialogue: props.dialogue,
    dialogues: props.dialogues,
    setDialogue: props.setDialogue,
    loading: props.loading,
    proccessAssistantText: props.proccessAssistantText,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
  }), [model, props.loading, props.dialogue, props.dialogues]);

  return (
    // TODO: #ANY - придумать как передать дженерик в контекст
    <Context.Provider value={value as any}>
      {children}
    </Context.Provider>
  );
};

const useChatContext = <D extends Dialogue = Dialogue>(): ChatGlobalContextType<D> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a ChatGlobalProvider");
  }

  /// TODO: #ANY - придумать как передать дженерик в контекст
  return context as any;
};

const useChatModel = () => useChatContext().model;

export { ChatGlobalProvider, useChatContext, useChatModel };
