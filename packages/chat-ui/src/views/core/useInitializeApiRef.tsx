import * as React from 'react';
import { DialogueApi, getDialogueMockApi } from '../DialogueApi';
import { DDialogue, DMessage } from '../../models';
import { NOOP } from '../../utils/NOOP';

export type ApiRefType<DM extends DMessage, DD extends DDialogue<DM>> = {
  /**
   * Current dialogue API
   */
  dialogue: DialogueApi<DM>;
  /**
   * Triggered when another dialogue is opened.
   */
  onChangeDialogue: (dialogue: DD) => void;
  /**
   * Triggered when a new dialogue is opened.
   * @param dialogue
   */
  openNewDialogue: (dialogue: DD) => void;
};

export const useInitializeApiRef = <DM extends DMessage, DD extends DDialogue<DM>>(apiRef: React.MutableRefObject<ApiRefType<DM, DD>> | undefined) => {
  const ref = React.useRef<ApiRefType<DM, DD>>({
    dialogue: getDialogueMockApi(),
    onChangeDialogue: NOOP,
    openNewDialogue: NOOP,
  });

  return React.useMemo(() => {
    if (apiRef) {
      apiRef.current = ref.current;
    }

    return ref;
  }, [apiRef, ref]);
}
