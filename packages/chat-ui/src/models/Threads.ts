import { Message } from './MessageModel';
import { ObservableReactValue } from '../utils/observers';
import { ThreadModel, Thread } from './ThreadModel';
import { AdapterType } from '../views/adapter/AdapterType';
import { MessageSentParams } from './MessageSentParams';
import { ThreadListCache } from './ThreadListCache';
import { EventsEmitter } from './EventsEmitter';

export class Threads<DM extends Message, DD extends Thread<DM>> {
  readonly list = new ObservableReactValue<ThreadModel<DM, DD>[]>([]);

  readonly currentThread = new ObservableReactValue<ThreadModel<DM, DD> | undefined>(undefined);

  readonly listGroups = new ThreadListCache();

  readonly menuDrawerOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);

  readonly emitter = new EventsEmitter();

  constructor(
    adapter: AdapterType,
    threads: Thread[],
    onUserMessageSent: (params: MessageSentParams) => void | Promise<void>,
  ) {
    const threadConstructor = ((t: Thread)=> new ThreadModel(
      adapter.transformThread(t) as DD,
      onUserMessageSent,
    ));

    this.list.value = threads.map(threadConstructor);
  }

  get = (id: DD['id']) => {
    return this.list.value.find(d => d.id === id);
  }

  delete = (id: DD['id']) => {
    const thread = this.get(id);
    if (thread) {
      this.list.value = this.list.value.filter(d => d.id !== id);
    }
  }

  /**
   * Populates a Thread instance from provided data parameters, or fetches the existing instance
   * if it already exists in the list.
   *
   * @param params - The arguments required to create a Thread instance, including data and a stream function.
   * @returns The existing or newly created Thread instance.
   */
  /*fromData = (...params: ConstructorParameters<typeof ThreadModel<DM, DD>>) => {
    const [data, streamFn] = params;
    let thread = this.get(data.id);
    if (!thread) {
      thread = new ThreadModel(data, streamFn);
      this.list.value = [...this.list.value, thread];
    }
    return thread;
  }*/

  createFromData = (...params: ConstructorParameters<typeof ThreadModel<DM, DD>>) => {
    const [data, streamFn] = params;
    return new ThreadModel(data, streamFn);
  }

  setMenuDrawerOpen = (v: boolean) => {
    this.menuDrawerOpen.value = v;
  }

  setDeleteItem = (v: Thread | undefined) => {
    this.deleteItem.value = v;
  }
}
