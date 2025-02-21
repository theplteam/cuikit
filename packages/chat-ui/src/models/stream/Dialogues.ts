import { DMessage } from '../MessageModel';
import { Thread } from '../ThreadData';
import { ObservableReactValue } from '../../utils/observers';
import { ThreadModel } from '../ThreadModel';
import { ChatActions } from '../ChatActions';

export class Dialogues<DM extends DMessage, DD extends Thread<DM>> {
  readonly list = new ObservableReactValue<ThreadModel<DM, DD>[]>([]);

  readonly currentDialogue = new ObservableReactValue<ThreadModel<DM, DD> | undefined>(undefined);

  readonly actions = new ChatActions<DM, DD>();

  get = (id: DD['id']) => {
    return this.list.value.find(d => d.id === id);
  }

  delete = (id: DD['id']) => {
    const dialogue = this.get(id);
    if (dialogue) {
      this.list.value = this.list.value.filter(d => d.id !== id);
    }
  }


  /**
   * Populates a Dialogue instance from provided data parameters, or fetches the existing instance
   * if it already exists in the list.
   *
   * @param params - The arguments required to create a Dialogue instance, including data and a stream function.
   * @returns The existing or newly created Dialogue instance.
   */
  fromData = (...params: ConstructorParameters<typeof ThreadModel<DM, DD>>) => {
    const [data, streamFn] = params;
    let dialogue = this.get(data.id);
    if (!dialogue) {
      dialogue = new ThreadModel(data, streamFn);
      this.list.value = [...this.list.value, dialogue];
    }
    return dialogue;
  }
}
