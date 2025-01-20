import { ObservableReactValue } from './ObservableReactValue';
import { FnType } from '../types';
import { reaction } from './reaction';

export const when = <T>(
  observableValue: ObservableReactValue<T>,
  condition: (value: T) => boolean,
  callback: FnType,
) => {
  return new Promise<void>((resolve) => {
    const disposer = reaction(
      observableValue,
      (value) => {
        if (condition(value)) {
          callback();
          disposer();
          resolve();
        }
      },
      {
        fireImmediately: true,
      }
    );
  });
}
