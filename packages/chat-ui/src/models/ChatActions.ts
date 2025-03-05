import { ThreadModel } from './ThreadModel';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { Message } from './MessageModel';
import { Thread } from './ThreadData';

export class ChatActions<DM extends Message, DD extends Thread<DM>> {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<ThreadModel<DM, DD> | undefined>(undefined);
}
