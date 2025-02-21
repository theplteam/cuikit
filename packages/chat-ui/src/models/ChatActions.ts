import { ThreadModel } from './ThreadModel';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { DMessage } from './MessageModel';
import { Thread } from './ThreadData';

export class ChatActions<DM extends DMessage, DD extends Thread<DM>> {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<ThreadModel<DM, DD> | undefined>(undefined);
}
