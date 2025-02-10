import { Dialogue } from './Dialogue';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { DMessage } from './Message';
import { DDialogue } from './DialogueData';

export class ChatActions<DM extends DMessage, DD extends DDialogue<DM>> {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly mobileImageDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Dialogue<DM, DD> | undefined>(undefined);

  readonly shareItem = new ObservableReactValue<Dialogue<DM, DD> | undefined>(undefined);

  readonly viewItem = new ObservableReactValue<Dialogue<DM, DD> | undefined>(undefined);
}
