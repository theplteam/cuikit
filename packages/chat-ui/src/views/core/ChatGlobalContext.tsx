import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { DDialogue, Dialogue, DMessage } from '../../models';
import { PrivateApiRefType } from './useApiRef';
import { Dialogues } from '../../models/stream/Dialogues';
import { useObserverValue } from '../hooks/useObserverValue';
import { FnType } from '../../models/types';
import { useAdapterContext } from '../adapter/AdapterContext';
import { useApiRefInitialization } from './useApiRefInitialization';
import { ApiManager } from './useApiManager';

type ChatGlobalContextType<DM extends DMessage, DD extends DDialogue<DM>> = {
  dialogue: Dialogue<DM, DD> | undefined;
  dialogues: Dialogue<DM, DD>[];
  apiRef: React.RefObject<PrivateApiRefType>;
  model: Dialogues<DM, DD>;
  actionsAssistant: { element: Exclude<ChatPropsTypes<DM, DD>['assistantActions'], undefined>[number] }[];
  handleCreateNewDialogue: FnType<DD>;
  disableMessageRating?: boolean;
} & Omit<ChatPropsTypes<DM, DD>, 'assistantActions' | 'dialogue' | 'dialogues' | 'handleCreateNewDialogue'>;

const Context = React.createContext<ChatGlobalContextType<any, any> | undefined>(undefined);

type ProviderProps<DM extends DMessage, DD extends DDialogue<DM>> = React.PropsWithChildren<{
  props: ChatPropsTypes<DM, DD>,
  apiManager: ApiManager;
}>;

const ChatGlobalProvider = <DM extends DMessage, DD extends DDialogue<DM>>({ props, children, apiManager }: ProviderProps<DM, DD>) => {
  const [model] = React.useState(new Dialogues<DM, DD>());
  const currentDialogue = useObserverValue(model.currentDialogue);
  const dialogues = useObserverValue(model.list) ?? [];

  useApiRefInitialization(
    apiManager,
    model,
    props,
  );

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
    apiRef: apiManager.apiRef,
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

  /// TODO: #ANY
  return context as any;
};

const useChatModel = () => useChatContext().model;

export { ChatGlobalProvider, useChatContext, useChatModel };
