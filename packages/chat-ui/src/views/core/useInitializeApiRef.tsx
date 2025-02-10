import * as React from 'react';
import { DialogueApi, getDialogueMockApi } from '../DialogueApi';
import { DDialogue, DMessage } from '../../models';
import { NOOP } from '../../utils/NOOP';

export type ApiRefType<DM extends DMessage, DD extends DDialogue<DM>> = {
  dialogue: DialogueApi<DM>;
  onChangeDialogue: (dialogue: DD) => void;
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
