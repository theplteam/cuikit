import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from './message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from './message/hooks/useMessagesMode';
import { DialogueApi, getDialogueMockApi } from './DialogueApi';
import { getDialogueListeners } from './utils/getDialogueListeners';
import { ChatDialogue } from '../models/ChatDialogue';

type DialogueContextType = {
  dialogue: ChatDialogue;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  dialogueApi: React.RefObject<DialogueApi>;
};

type Props = {
  children: React.ReactNode;
  dialogue: ChatDialogue;
  dialogueRef: React.MutableRefObject<DialogueApi | undefined>;
};

const Context = React.createContext<DialogueContextType | undefined>(undefined);

const DialogueProvider: React.FC<Props> = ({ children, dialogue, dialogueRef }) => {
  const mobileMessageActions = useMobileMessageActions();
  const apiRef = React.useRef<DialogueApi>(getDialogueMockApi());
  const messageMode = useMessagesMode();

  React.useMemo(() => {
    dialogue.messages.init();

    const messages = dialogue.messages;
    apiRef.current = {
      allMessages: messages.allMessages.value,
      branch: messages.currentMessages.value,
      getListener: getDialogueListeners(dialogue),
      handleChangeBranch: messages.handleChangeBranch,
    };

    if (dialogueRef) {
      dialogueRef.current = apiRef.current;
    }
  }, [dialogue]);

  /*const [state, setState] = React.useState(0)

  React.useEffect(() => {
    setInterval(() => {
      setState(ls => ++ls);
    }, 1000)
  }, []);
  console.log(state);*/

  const value = React.useMemo(() => ({
    dialogue, dialogueApi: apiRef, mobileMessageActions, messageMode
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
