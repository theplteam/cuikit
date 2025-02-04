import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from './message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from './message/hooks/useMessagesMode';
import { type DialogueApi, getDialogueMockApi } from './DialogueApi';
import { getDialogueListeners } from './utils/getDialogueListeners';
import { DialogueAbstract } from '../models/DialogueAbstract';
import { useMessageProgressStatus } from './dialogue/useMessageProgressStatus';
import { ApiRefType } from './core/useInitializeApiRef';

type DialogueContextType = {
  dialogue: DialogueAbstract | undefined;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  dialogueApi: React.RefObject<DialogueApi>;
};

type Props = {
  children: React.ReactNode;
  dialogue: DialogueAbstract | undefined;
  apiRef: React.RefObject<ApiRefType>;
};

const Context = React.createContext<DialogueContextType | undefined>(undefined);

const DialogueProvider: React.FC<Props> = ({ children, dialogue, apiRef }) => {
  const mobileMessageActions = useMobileMessageActions();
  const messageMode = useMessagesMode();
  const dialogueApi = React.useRef<DialogueApi>(getDialogueMockApi());
  const handleChangeStreamStatus = useMessageProgressStatus(dialogue);

  React.useMemo(() => {
    dialogue?.messages.init();

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

const useDialogueContext = (): DialogueContextType => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useMessagesContext must be used within a MessagesProvider");
  }

  return context;
};

export { DialogueProvider, useDialogueContext };
