import * as React from 'react';
import { Thread, ThreadModel, Message } from '../../models';

export const useMessageProgressStatus = <DM extends Message, DD extends Thread<DM>>(thread: ThreadModel<DM, DD> | undefined) => {
  return React.useCallback((status: string) => {
    if (thread) {
      thread.streamStatus.value = status;
    }
  }, [thread]);
}
