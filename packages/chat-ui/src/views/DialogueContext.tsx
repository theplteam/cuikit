import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from './message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from './message/hooks/useMessagesMode';
import { type DialogueApi, getDialogueMockApi } from './DialogueApi';
import { getDialogueListeners } from './utils/getDialogueListeners';
import { Dialogue } from '../models/Dialogue';
import { useMessageProgressStatus } from './dialogue/useMessageProgressStatus';
import { ApiRefType } from './core/useInitializeApiRef';
import { DDialogue, DMessage } from '../models';

type DialogueContextType<DM extends DMessage, DD extends DDialogue<DM>> = {
  dialogue: Dialogue<DM, DD> | undefined;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  dialogueApi: React.RefObject<DialogueApi<DM>>;
};

type Props<DM extends DMessage, DD extends DDialogue<DM>> = {
  children: React.ReactNode;
  dialogue: Dialogue<DM, DD> | undefined;
  apiRef: React.RefObject<ApiRefType<DM, DD>>;
  enableBranches: boolean | undefined;
};

const Context = React.createContext<DialogueContextType<any, any> | undefined>(undefined);

const DialogueProvider = <DM extends DMessage, DD extends DDialogue<DM>>({ children, dialogue, apiRef, enableBranches }: Props<DM, DD>) => {
  const mobileMessageActions = useMobileMessageActions();
  const messageMode = useMessagesMode();
  const dialogueApi = React.useRef<DialogueApi<DM>>(getDialogueMockApi());
  const handleChangeStreamStatus = useMessageProgressStatus(dialogue);

  React.useMemo(() => {
    dialogue?.messages.init(enableBranches);

    if (dialogue) {
      const messages = dialogue.messages;
      dialogueApi.current = {
        allMessages: messages.allMessages,
        branch: messages.currentMessages,
        getListener: getDialogueListeners(dialogue),
        handleChangeBranch: messages.handleChangeBranch,
        setProgressStatus: handleChangeStreamStatus,
      };
    }

    if (apiRef.current) {
      apiRef.current.dialogue = dialogueApi.current;
    }
  }, [dialogue, handleChangeStreamStatus]);

  /*const [state, setState] = React.useState(0)

  React.useEffect(() => {
    setInterval(() => {
      setState(ls => ++ls);
    }, 1000)
  }, []);
  console.log(state);*/

  const value = React.useMemo(() => ({
    dialogue, dialogueApi, mobileMessageActions, messageMode
  }), [dialogue, apiRef.current, mobileMessageActions, messageMode]);

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
