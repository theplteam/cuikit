import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { Thread } from './ThreadModel';

export class ChatActions {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);
}
