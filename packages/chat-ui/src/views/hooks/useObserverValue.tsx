import { ObservableReactValue } from '../../utils/observers/ObservableReactValue';
import { useSyncExternalStore } from 'react';
import { NOOP } from '../../utils/NOOP';

export const useObserverValue = <T,>(model: ObservableReactValue<T> | undefined, defaultValue?: T) => {
  return useSyncExternalStore(
    model?.subscribe ?? (() => NOOP),
    model?.getSnapshot ?? (() => defaultValue),
  );
}
