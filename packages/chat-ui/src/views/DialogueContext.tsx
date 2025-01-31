import * as React from 'react';
import { MobileMessageActionsType, useMobileMessageActions } from './message/hooks/useMobileMessageActions';
import { MessagesModeType, useMessagesMode } from './message/hooks/useMessagesMode';
import { DialogueApi, getDialogueMockApi } from './DialogueApi';
import { getDialogueListeners } from './utils/getDialogueListeners';
import { Dialogue } from '../models/dialogue/Dialogue';

type DialogueContextType = {
  dialogue: Dialogue | undefined;
  mobileMessageActions: MobileMessageActionsType;
  messageMode: MessagesModeType;
  dialogueApi: React.RefObject<DialogueApi>;
};

type Props = {
  children: React.ReactNode;
  dialogue: Dialogue | undefined;
  dialogueRef: React.MutableRefObject<DialogueApi | undefined>;
};

const Context = React.createContext<DialogueContextType | undefined>(undefined);

const DialogueProvider: React.FC<Props> = ({ children, dialogue, dialogueRef }) => {
  const mobileMessageActions = useMobileMessageActions();
  const apiRef = React.useRef<DialogueApi>(getDialogueMockApi());
  const messageMode = useMessagesMode();

  React.useMemo(() => {
    dialogue?.messages.init();

    if (dialogue) {
      const messages = dialogue.messages;
      apiRef.current = {
        allMessages: messages.allMessages,
        branch: messages.currentMessages,
        getListener: getDialogueListeners(dialogue),
        handleChangeBranch: messages.handleChangeBranch,
      };
    }

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
