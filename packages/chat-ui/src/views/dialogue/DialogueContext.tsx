import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from '../message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from '../message/hooks/useMessagesMode';
import { Dialogue } from '../../models/Dialogue';
import { DDialogue, DMessage } from '../../models';
import { ApiManager } from '../core/useApiManager';
import { useDialogueApiInitialization } from './useDialogueApiInitialization';
import { PrivateApiRefType } from '../core/useApiRef';
import { useDialogueSendMessage } from './useDialogueSendMessage';
import { type ChatGlobalContextType } from '../core/ChatGlobalContext';
import { ChatScrollApiRef } from './ChatScroller';

type DialogueContextType<DM extends DMessage, DD extends DDialogue<DM>> = {
  dialogue: Dialogue<DM, DD> | undefined;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  apiRef: React.RefObject<PrivateApiRefType<DM>>;
};

type Props<DM extends DMessage, DD extends DDialogue<DM>> = React.PropsWithChildren<{
  dialogue: Dialogue<DM, DD> | undefined;
  apiManager: ApiManager;
  scrollRef: React.RefObject<ChatScrollApiRef>;
  globalProps: Pick<ChatGlobalContextType<any, any>, 'onDialogueCreated' | 'onAssistantMessageTypingFinish' | 'enableBranches'>;
}>;

const Context = React.createContext<DialogueContextType<any, any> | undefined>(undefined);

const DialogueProvider = <DM extends DMessage, DD extends DDialogue<DM>>({ children, dialogue, apiManager, scrollRef, globalProps }: Props<DM, DD>) => {
  const mobileMessageActions = useMobileMessageActions();
  const messageMode = useMessagesMode();

  const onMessageSend = useDialogueSendMessage(
    dialogue,
    globalProps.onDialogueCreated,
    globalProps.onAssistantMessageTypingFinish,
    scrollRef.current ?? undefined,
  );

  useDialogueApiInitialization(dialogue, apiManager, onMessageSend);

  React.useMemo(() => {
    dialogue?.messages.init(globalProps.enableBranches);
  }, [dialogue]);

  /*const [state, setState] = React.useState(0)

  React.useEffect(() => {
    setInterval(() => {
      setState(ls => ++ls);
    }, 1000)
  }, []);
  console.log(state);*/

  const value = React.useMemo(() => ({
    dialogue, apiRef: apiManager.apiRef, mobileMessageActions, messageMode
  }), [dialogue, apiManager.apiRef.current, messageMode, mobileMessageActions]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useDialogueContext = <DM extends DMessage, DD extends DDialogue<DM>>(): DialogueContextType<DM, DD> => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a MessagesProvider");
  }

  return context;
};

export { DialogueProvider, useDialogueContext };
