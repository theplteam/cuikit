import { ObservableReactValue } from './ObservableReactValue';
import { FnType } from '../../models/types';
import { reaction } from './reaction';

export const when = <T>(
  observableValue: ObservableReactValue<T>,
  condition: (value: T) => boolean,
  callback: FnType,
  options?: any,
) => {
  return new Promise<void>((resolve) => {
    const disposer = reaction(
      observableValue,
      (value) => {
        if (condition(value)) {
          requestAnimationFrame(() => {
            callback();
            disposer();
            resolve();
          });
        }
      },
      {
        fireImmediately: true,
      }
    );
  });
}
