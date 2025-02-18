import * as React from 'react';
import { DialogueApi, DialogueApiUser, getDialogueMockApi } from '../DialogueApi';
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

export type ApiRefUserType<DM extends DMessage = any, DD extends DDialogue<DM> = any> = {
  dialogue: DialogueApiUser<DM>;
} & Omit<ApiRefType<DM, DD>, 'dialogue'>;

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
