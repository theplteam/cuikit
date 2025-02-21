import * as React from 'react';
import { Thread, ThreadModel, DMessage } from '../../models';

export const useMessageProgressStatus = <DM extends DMessage, DD extends Thread<DM>>(dialogue: ThreadModel<DM, DD> | undefined) => {
  return React.useCallback((status: string) => {
    if (dialogue) {
      dialogue.streamStatus.value = status;
    }
  }, [dialogue]);
}
