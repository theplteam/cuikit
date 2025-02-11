import * as React from 'react';
import { AdapterType } from './AdapterType';
import { AdapterContext } from './AdapterContext';

export type AdapterProviderProps = React.PropsWithChildren<Partial<AdapterType>>;

export const AdapterProvider = ({ children, transformDialogue, transformMessage }: AdapterProviderProps) => {

  const baseDialogueTransormer = React.useCallback((dialogue: any) => {
    if (!!transformMessage && Array.isArray(dialogue.messages)) {
      console.log(dialogue.messages.map(transformMessage))
      return {
        ...dialogue,
        messages: dialogue.messages.map(transformMessage)
      };
    }

    return dialogue;
  }, [transformMessage]);

  const value = React.useMemo(
    () => ({ transformDialogue: transformDialogue ?? baseDialogueTransormer, transformMessage }),
    [transformDialogue, transformMessage, baseDialogueTransormer]
  );

  return (
    <AdapterContext.Provider value={value}>
      {children}
    </AdapterContext.Provider>
  );
};
