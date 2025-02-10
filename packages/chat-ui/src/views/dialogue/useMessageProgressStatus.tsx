import * as React from 'react';
import { DDialogue, Dialogue, DMessage } from '../../models';

export const useMessageProgressStatus = <DM extends DMessage, DD extends DDialogue<DM>>(dialogue: Dialogue<DM, DD> | undefined) => {
  return React.useCallback((status: string) => {
    if (dialogue) {
      dialogue.streamStatus.value = status;
    }
  }, [dialogue]);
}
