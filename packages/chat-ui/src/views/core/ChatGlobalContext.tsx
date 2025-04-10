import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { Thread, ThreadModel, Message } from '../../models';
import { PrivateApiRefType } from './useApiRef';
import { Threads } from '../../models/Threads';
import { useObserverValue } from '../hooks/useObserverValue';
import { FnType } from '../../models/types';
import { useAdapterContext } from '../adapter/AdapterContext';
import { useApiRefInitialization } from './useApiRefInitialization';
import { ApiManager } from './useApiManager';

export type ChatGlobalContextType<DM extends Message, DD extends Thread<DM>> = {
  threads: ThreadModel<DM, DD>[];
  apiRef: React.RefObject<PrivateApiRefType>;
  model: Threads<DM, DD>;
  actionsAssistant: { element: Exclude<ChatPropsTypes<DM, DD>['assistantActions'], undefined>[number] }[];
  handleCreateNewThread: FnType<DD>;
  disableMessageRating?: boolean;
} & Omit<ChatPropsTypes<DM, DD>, 'assistantActions' | 'thread' | 'threads' | 'handleCreateNewThread'>;

const Context = React.createContext<ChatGlobalContextType<any, any> | undefined>(undefined);

type ProviderProps<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  props: ChatPropsTypes<DM, DD>,
  apiManager: ApiManager;
}>;

const ChatGlobalProviderComponent = <DM extends Message, DD extends Thread<DM>>({ props, children, apiManager }: ProviderProps<DM, DD>) => {
  const threadAdapter = useAdapterContext();

  const model = React.useMemo(() => new Threads<DM, DD>(
    threadAdapter,
    props.threads,
    props.thread,
    props.onUserMessageSent,
  ), []);

  const threads = useObserverValue(model.list) ?? [];

  useApiRefInitialization(
    apiManager,
    model,
    props,
  );

  const value: ChatGlobalContextType<DM, DD> = React.useMemo(() => ({
    ...props,
    apiRef: apiManager.apiRef,
    model,
    threads,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
    handleCreateNewThread: props.handleCreateNewThread ?? ThreadModel.createEmptyData as FnType<DD>,
  }), [model, props, props.loading, threads]);

  return (
    // TODO: #ANY - придумать как передать дженерик в контекст
    <Context.Provider value={value as any}>
      {children}
    </Context.Provider>
  );
};

const useChatContext = <DM extends Message, DD extends Thread<DM>>(): ChatGlobalContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a ChatGlobalProvider");
  }

  /// TODO: #ANY
  return context as any;
};

const useChatModel = () => useChatContext().model;

const ChatGlobalProvider = React.memo(ChatGlobalProviderComponent, (prevProps, nextProps) => {
  return Object.keys(prevProps).join('') === Object.keys(nextProps).join('')
    && prevProps.props.threads.length === nextProps.props.threads.length
    && prevProps.props.loading === nextProps.props.loading;
});

export { ChatGlobalProvider, useChatContext, useChatModel };
