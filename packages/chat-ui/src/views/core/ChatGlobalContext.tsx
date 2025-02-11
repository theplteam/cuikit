import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { DDialogue, Dialogue, DMessage } from '../../models';
import { ApiRefType } from './useInitializeApiRef';
import { Dialogues } from '../../models/stream/Dialogues';
import { useObserverValue } from '../hooks/useObserverValue';
import { FnType } from '../../models/types';
import { useAdapterContext } from '../adapter/AdapterContext';

type ChatGlobalContextType<DM extends DMessage, DD extends DDialogue<DM>> = {
  dialogue: Dialogue<DM, DD> | undefined;
  dialogues: Dialogue<DM, DD>[];
  apiRef: React.RefObject<ApiRefType<DM, DD>>;
  model: Dialogues<DM, DD>;
  actionsAssistant: { element: Exclude<ChatPropsTypes<DM, DD>['assistantActions'], undefined>[number] }[];
  handleCreateNewDialogue: FnType<DD>;
} & Omit<ChatPropsTypes<DM, DD>, 'assistantActions' | 'dialogue' | 'dialogues' | 'handleCreateNewDialogue'>;

const Context = React.createContext<ChatGlobalContextType<any, any> | undefined>(undefined);

type ProviderProps<DM extends DMessage, DD extends DDialogue<DM>> = React.PropsWithChildren<{
  props: ChatPropsTypes<DM, DD>,
  apiRef: React.RefObject<ApiRefType<DM, DD>>;
}>;

const ChatGlobalProvider = <DM extends DMessage, DD extends DDialogue<DM>>({ props, children, apiRef }: ProviderProps<DM, DD>) => {
  const [model] = React.useState(new Dialogues<DM, DD>());
  const currentDialogue = useObserverValue(model.currentDialogue);
  const dialogues = useObserverValue(model.list) ?? [];

  /**
   * Initialize API methods
   * TODO: peredelat, sechas krivo
   */
  React.useMemo(() => {
    if (!apiRef.current) return;
    apiRef.current.onChangeDialogue = (dialogue) => {
      model.currentDialogue.value = model.get(dialogue.id);
    };

    apiRef.current.openNewDialogue = (dialogue) => {
      const dialogueInstance = model.fromData(dialogue, props.onUserMessageSent);
      model.currentDialogue.value = dialogueInstance;
    };
  }, [apiRef.current]);

  const dialogueAdapter = useAdapterContext();

  /**
   * Effect to initialize the provider model with the dialogues provided in the props.
   * It converts the dialogues into instances of the `Dialogue` class and synchronizes
   * the currently active dialogue (if defined in `props.dialogue`) with the `model`.
   */
  React.useEffect(() => {
    model.list.value = props.dialogues.map(v => new Dialogue(
      dialogueAdapter.transformDialogue(v) as DD,
      props.onUserMessageSent)
    );
    if (props.dialogue?.id) {
      model.currentDialogue.value = model.get(props.dialogue.id);
    }
  }, []);

  const value: ChatGlobalContextType<DM, DD> = React.useMemo(() => ({
    ...props,
    apiRef,
    model,
    dialogues,
    dialogue: currentDialogue,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
    handleCreateNewDialogue: props.handleCreateNewDialogue ?? Dialogue.createEmptyData as FnType<DD>,
  }), [model, currentDialogue, props, props.loading, dialogues]);

  return (
    // TODO: #ANY - придумать как передать дженерик в контекст
    <Context.Provider value={value as any}>
      {children}
    </Context.Provider>
  );
};

const useChatContext = <DM extends DMessage, DD extends DDialogue<DM>>(): ChatGlobalContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a ChatGlobalProvider");
  }

  /// TODO: #ANY - придумать как передать дженерик в контекст
  return context as any;
};

const useChatModel = () => useChatContext().model;

export { ChatGlobalProvider, useChatContext, useChatModel };
