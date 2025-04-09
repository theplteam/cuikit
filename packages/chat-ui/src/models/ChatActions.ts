import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { Thread } from './ThreadData';

export class ChatActions {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);
}
