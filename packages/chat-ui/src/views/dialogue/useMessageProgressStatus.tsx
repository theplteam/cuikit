import * as React from 'react';
import { DialogueAbstract } from '../../models';

export const useMessageProgressStatus = (dialogue: DialogueAbstract | undefined) => {
  return React.useCallback((status: string) => {
    if (dialogue) {
      dialogue.streamStatus.value = status;
    }
  }, [dialogue]);
}
