import { ObservableReactValue } from '../utils/observers';
import { ThreadModel } from './ThreadModel';
import { arrayPluck } from '../utils/arrayUtils/arrayPluck';

export type ListGroupType = {
  label: string;
  timestamp: number;
  id: string;
};

export class ThreadListGroupItem {
  threads = new ObservableReactValue<ThreadModel[]>([]);

  constructor(readonly data: ListGroupType) {}

  checkList = (threads: ThreadModel[]) => {
    const newIds = arrayPluck(threads, 'id').sort().join('-');
    const currentIds = arrayPluck(this.threads.value, 'id').sort().join('-');
    if (newIds !== currentIds) {
      this.threads.value = threads.sort((a, b) => b.time - a.time);
    }
  }
}
