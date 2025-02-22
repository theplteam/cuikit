import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { Thread, ThreadModel, DMessage } from '../../models';
import { PrivateApiRefType } from './useApiRef';
import { Threads } from '../../models/Threads';
import { useObserverValue } from '../hooks/useObserverValue';
import { FnType } from '../../models/types';
import { useAdapterContext } from '../adapter/AdapterContext';
import { useApiRefInitialization } from './useApiRefInitialization';
import { ApiManager } from './useApiManager';

export type ChatGlobalContextType<DM extends DMessage, DD extends Thread<DM>> = {
  thread: ThreadModel<DM, DD> | undefined;
  threads: ThreadModel<DM, DD>[];
  apiRef: React.RefObject<PrivateApiRefType>;
  model: Threads<DM, DD>;
  actionsAssistant: { element: Exclude<ChatPropsTypes<DM, DD>['assistantActions'], undefined>[number] }[];
  handleCreateNewThread: FnType<DD>;
  disableMessageRating?: boolean;
} & Omit<ChatPropsTypes<DM, DD>, 'assistantActions' | 'thread' | 'threads' | 'handleCreateNewThread'>;

const Context = React.createContext<ChatGlobalContextType<any, any> | undefined>(undefined);

type ProviderProps<DM extends DMessage, DD extends Thread<DM>> = React.PropsWithChildren<{
  props: ChatPropsTypes<DM, DD>,
  apiManager: ApiManager;
}>;

const ChatGlobalProvider = <DM extends DMessage, DD extends Thread<DM>>({ props, children, apiManager }: ProviderProps<DM, DD>) => {
  const [model] = React.useState(new Threads<DM, DD>());
  const currentDialogue = useObserverValue(model.currentThread);
  const threads = useObserverValue(model.list) ?? [];

  useApiRefInitialization(
    apiManager,
    model,
    props,
  );

  const dialogueAdapter = useAdapterContext();

  /**
   * Effect to initialize the provider model with the threads provided in the props.
   * It converts the threads into instances of the `Thread` class and synchronizes
   * the currently active thread (if defined in `props.thread`) with the `model`.
   */
  React.useEffect(() => {
    model.list.value = props.threads.map(v => new ThreadModel(
      dialogueAdapter.transformThread(v) as DD,
      props.onUserMessageSent)
    );
    if (props.thread?.id) {
      model.currentThread.value = model.get(props.thread.id);
    }
  }, []);

  const value: ChatGlobalContextType<DM, DD> = React.useMemo(() => ({
    ...props,
    apiRef: apiManager.apiRef,
    model,
    threads,
    thread: currentDialogue,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
    handleCreateNewThread: props.handleCreateNewThread ?? ThreadModel.createEmptyData as FnType<DD>,
  }), [model, currentDialogue, props, props.loading, threads]);

  return (
    // TODO: #ANY - придумать как передать дженерик в контекст
    <Context.Provider value={value as any}>
      {children}
    </Context.Provider>
  );
};

const useChatContext = <DM extends DMessage, DD extends Thread<DM>>(): ChatGlobalContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a ChatGlobalProvider");
  }

  /// TODO: #ANY
  return context as any;
};

const useChatModel = () => useChatContext().model;

export { ChatGlobalProvider, useChatContext, useChatModel };
