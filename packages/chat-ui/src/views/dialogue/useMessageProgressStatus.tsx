import * as React from 'react';
import { Dialogue } from '../../models';

export const useMessageProgressStatus = (dialogue: Dialogue | undefined) => {
  return React.useCallback((status: string) => {
    if (dialogue) {
      dialogue.streamStatus.value = status;
    }
  }, [dialogue]);
}
