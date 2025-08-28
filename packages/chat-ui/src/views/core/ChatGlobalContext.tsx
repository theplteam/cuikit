import * as React from 'react';
import { ChatPropsTypes } from './useChatProps';
import { Thread, ThreadModel, Message, FileAttachedParams } from '../../models';
import { PrivateApiRefType } from './useApiRef';
import { Threads } from '../../models/Threads';
import { FnType } from '../../models/types';
import SnackbarModel from '../../models/SnackbarModel';
import { useAdapterContext } from '../adapter/AdapterContext';
import { useApiRefInitialization } from './useApiRefInitialization';
import { ApiManager } from './useApiManager';

export type ChatGlobalContextType<DM extends Message = any, DD extends Thread<DM> = any> = {
  apiRef: React.RefObject<PrivateApiRefType>;
  model: Threads<DM, DD>;
  actionsAssistant: { element: Exclude<ChatPropsTypes<DM, DD>['assistantActions'], undefined>[number] }[];
  handleCreateNewThread: FnType<DD>;
  snackbar: SnackbarModel;
  onFileAttached?: (params: FileAttachedParams) => Promise<void> | void;
} & Omit<ChatPropsTypes<DM, DD>, 'assistantActions' | 'thread' | 'threads' | 'handleCreateNewThread'>;

const Context = React.createContext<ChatGlobalContextType<any, any> | undefined>(undefined);

type ProviderProps<DM extends Message = any, DD extends Thread<DM> = any> = React.PropsWithChildren<{
  props: ChatPropsTypes<DM, DD>,
  apiManager: ApiManager;
}>;

const ChatGlobalProviderComponent = ({ props, children, apiManager }: ProviderProps) => {
  const threadAdapter = useAdapterContext();

  const model = React.useMemo(() => new Threads(
    threadAdapter,
    props.threads,
    props.onUserMessageSent,
    // Model is not needed while data for the chat is loading
    // therefore it needs to be recreated, since changes may occur during loading
  ), [props.loading]);

  const snackbar = React.useMemo(() => new SnackbarModel(props.onShowAlert), [props.onShowAlert]);

  useApiRefInitialization(
    apiManager,
    model,
    props,
  );

  React.useEffect(() => {
    if (!props.loading && props.initialThread) {
      apiManager.apiRef.current?.onChangeThread(props.initialThread.id);
    }
  }, [props.loading]);

  const value: ChatGlobalContextType = React.useMemo(() => ({
    ...props,
    apiRef: apiManager.apiRef,
    model,
    snackbar,
    actionsAssistant: (props.assistantActions ?? []).map(element => ({ element })),
    handleCreateNewThread: props.handleCreateNewThread ?? ThreadModel.createEmptyData,
  }), [model, props, props.loading]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useChatContext = <DM extends Message, DD extends Thread<DM>>(): ChatGlobalContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatGlobalProvider");
  }

  return context;
};

export const useSafeChatContext = <DM extends Message, DD extends Thread<DM>>()  => {
  return (React.useContext(Context) ?? {}) as ChatGlobalContextType<DM, DD>;
};

const useChatModel = () => useChatContext().model;

const ChatGlobalProvider = React.memo(ChatGlobalProviderComponent, (prevProps, nextProps) => {
  return Object.keys(prevProps).join('') === Object.keys(nextProps).join('')
    // && prevProps.props.threads.length === nextProps.props.threads.length
    && prevProps.props.loading === nextProps.props.loading;
});

export { ChatGlobalProvider, useChatContext, useChatModel };
