import { DialogueAbstract } from './DialogueAbstract';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';

export class ChatActions {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<DialogueAbstract | undefined>(undefined);

  readonly shareItem = new ObservableReactValue<DialogueAbstract | undefined>(undefined);

  readonly viewItem = new ObservableReactValue<DialogueAbstract | undefined>(undefined);
}
