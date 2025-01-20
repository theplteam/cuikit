import { ObservableReactValue } from './ObservableReactValue';

export type ReactionOptions = Partial<{
  fireImmediately: boolean;
}>;

export const reaction = <T>(observableValue: ObservableReactValue<T>, callback: (value: T) => void, options?: ReactionOptions) => {
  const disposer = observableValue.subscribe(() => {
    callback(observableValue.value);
  });
  if (options?.fireImmediately) callback(observableValue.value);

  return disposer;
}
