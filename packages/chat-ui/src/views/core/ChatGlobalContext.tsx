import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { ArrayType } from '../../models/types';
import { ChatModel } from '../../models/ChatModel';
import { Dialogue } from 'models/Dialogue';

type ChatGlobalContextType = {
  model: ChatModel<Dialogue>;
  dialogue: Dialogue | undefined;
  dialogues: ArrayType<Dialogue>;
  setDialogue: (dialogue: Dialogue) => void;
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
    loading: props.loading,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
  }), [model, props.loading, props.dialogue, props.dialogues]);

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

export { ChatGlobalProvider, useChatContext, useChatModel };
