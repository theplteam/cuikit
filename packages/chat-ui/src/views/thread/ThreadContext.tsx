import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from '../message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from '../message/hooks/useMessagesMode';
import { ThreadModel } from '../../models/ThreadModel';
import { Thread, Message } from '../../models';
import { ApiManager } from '../core/useApiManager';
import { useThreadApiInitialization } from './useThreadApiInitialization';
import { PrivateApiRefType } from '../core/useApiRef';
import { useThreadSendMessage } from './useThreadSendMessage';
import { type ChatGlobalContextType } from '../core/ChatGlobalContext';
import { ChatScrollApiRef } from './ChatScroller';
import { Threads } from '../../models/Threads';
import { useInternalMessageTransformer } from '../adapter/AdapterContext';

type ThreadContextType<DM extends Message, DD extends Thread<DM>> = {
  thread: ThreadModel<DM, DD> | undefined;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  apiRef: React.RefObject<PrivateApiRefType<DM>>;
};

type Props<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  model: Threads<DM, DD>;
  thread: ThreadModel<DM, DD> | undefined;
  apiManager: ApiManager;
  scrollRef: React.RefObject<ChatScrollApiRef>;
  globalProps: Pick<
    ChatGlobalContextType<any, any>,
    'onFirstMessageSent' | 'onAssistantMessageTypingFinish' | 'enableBranches' | 'beforeUserMessageSend' | 'getCurrentBranch'
  >;
}>;

const Context = React.createContext<ThreadContextType<any, any> | undefined>(undefined);

const ThreadProvider = <DM extends Message, DD extends Thread<DM>>({ children, model, thread, apiManager, scrollRef, globalProps }: Props<DM, DD>) => {
  const mobileMessageActions = useMobileMessageActions();
  const messageMode = useMessagesMode();
  const internalMessageTransformer = useInternalMessageTransformer();

  const { onSendNewsMessage, onEditMessage } = useThreadSendMessage(
    thread,
    model,
    globalProps.onFirstMessageSent,
    globalProps.beforeUserMessageSend,
    globalProps.onAssistantMessageTypingFinish,
    scrollRef.current ?? undefined,
  );

  useThreadApiInitialization(thread, apiManager, onSendNewsMessage, onEditMessage);

  React.useMemo(() => {
    if (thread) {
      thread.messages.getCurrentBranchFn = globalProps.getCurrentBranch;
      thread.messages.internalMessageTransformer = internalMessageTransformer;
      thread.messages.init(globalProps.enableBranches);
    }
  }, [thread]);

  /*const [state, setState] = React.useState(0)

  React.useEffect(() => {
    setInterval(() => {
      setState(ls => ++ls);
    }, 1000)
  }, []);
  console.log(state);*/

  const value = React.useMemo(() => ({
    thread, apiRef: apiManager.apiRef, mobileMessageActions, messageMode
  }), [thread, apiManager.apiRef.current, messageMode, mobileMessageActions]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useThreadContext = <DM extends Message, DD extends Thread<DM>>(): ThreadContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useThreadContext must be used within a ThreadProvider");
  }

  return context;
};

export { ThreadProvider, useThreadContext };
