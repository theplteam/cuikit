import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from './message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from './message/hooks/useMessagesMode';
import { Dialogue } from '../models/Dialogue';
import { DDialogue, DMessage } from '../models';
import { ApiManager } from './core/useApiManager';
import { useDialogueApiInitialization } from './dialogue/useDialogueApiInitialization';
import { PrivateApiRefType } from './core/useApiRef';

type DialogueContextType<DM extends DMessage, DD extends DDialogue<DM>> = {
  dialogue: Dialogue<DM, DD> | undefined;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  apiRef: React.RefObject<PrivateApiRefType<DM>>;
};

type Props<DM extends DMessage, DD extends DDialogue<DM>> = {
  children: React.ReactNode;
  dialogue: Dialogue<DM, DD> | undefined;
  apiManager: ApiManager;
  enableBranches: boolean | undefined;
};

const Context = React.createContext<DialogueContextType<any, any> | undefined>(undefined);

const DialogueProvider = <DM extends DMessage, DD extends DDialogue<DM>>({ children, dialogue, apiManager, enableBranches }: Props<DM, DD>) => {
  const mobileMessageActions = useMobileMessageActions();
  const messageMode = useMessagesMode();
  useDialogueApiInitialization(dialogue, apiManager);

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
