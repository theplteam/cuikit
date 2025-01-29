import { Dialogue } from 'models/Dialogue';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';

export class ChatActions {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Dialogue | undefined>(undefined);

  readonly shareItem = new ObservableReactValue<Dialogue | undefined>(undefined);

  readonly viewItem = new ObservableReactValue<Dialogue | undefined>(undefined);
}
