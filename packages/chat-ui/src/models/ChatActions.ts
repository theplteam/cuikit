import { ChatDialogue } from './ChatDialogue';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';

export class ChatActions {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<ChatDialogue | undefined>(undefined);

  readonly shareItem = new ObservableReactValue<ChatDialogue | undefined>(undefined);

  readonly viewItem = new ObservableReactValue<ChatDialogue | undefined>(undefined);
}
