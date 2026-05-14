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

  checkList = (threads: ThreadModel[], comparator?: (a: ThreadModel, b: ThreadModel) => number) => {
    const newIds = arrayPluck(threads, 'id').sort().join('-');
    const currentIds = arrayPluck(this.threads.value, 'id').sort().join('-');
    if (newIds !== currentIds) {
      const compare = comparator ?? ((a, b) => b.time - a.time);
      this.threads.value = [...threads].sort(compare);
    }
  }
}
