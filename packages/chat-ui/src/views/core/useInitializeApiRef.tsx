import * as React from 'react';
import { DialogueApi, getDialogueMockApi } from '../DialogueApi';

export type ApiRefType = {
  dialogue: DialogueApi;
};

export const useInitializeApiRef = (apiRef: React.MutableRefObject<ApiRefType> | undefined) => {
  const ref = React.useRef<ApiRefType>({
    dialogue: getDialogueMockApi()
  });

  return React.useMemo(() => {
    if (apiRef) {
      apiRef.current = ref.current;
    }

    return ref;
  }, [apiRef, ref]);
}
