import { ObservableReactValue } from '../utils/observers';
import { ThreadModel } from './ThreadModel';

export type ListGroupType = {
  label: string;
  timestamp: number;
  id: string;
};

export type ThreadListFlatHeader = {
  kind: 'header';
  /** Namespaced so a thread key can never collide with a group key. */
  key: string;
  groupId: string;
  group: ListGroupType;
};

export type ThreadListFlatRow = {
  kind: 'row';
  key: string;
  groupId: string;
  thread: ThreadModel;
};

export type ThreadListFlatItem = ThreadListFlatHeader | ThreadListFlatRow;

export type ThreadListProjection = {
  items: ThreadListFlatItem[];
  /** Ascending indexes into `items` that hold a group header. */
  headerIndexes: number[];
};

export const EMPTY_PROJECTION: ThreadListProjection = { items: [], headerIndexes: [] };

export const headerKey = (groupId: string) => `h:${groupId}`;

/**
 * Rows are keyed by `viewerUniqueKey`, not by `id`: `MessageSender.updateThreadId`
 * swaps a thread's id in place when the server assigns a real one, and that
 * mutation notifies nobody.
 */
export const rowKey = (thread: ThreadModel) => `t:${thread.viewerUniqueKey}`;

export class ThreadListGroupItem {
  threads = new ObservableReactValue<ThreadModel[]>([]);

  /**
   * Mutable on purpose: groups are reused across audits by key, and the label
   * is localized while the timestamp moves with the day boundary. Freezing this
   * at construction time strands headers in the old language and corrupts the
   * group ordering after midnight.
   */
  data: ListGroupType;

  constructor(data: ListGroupType) {
    this.data = data;
  }

  checkList = (threads: ThreadModel[], comparator?: (a: ThreadModel, b: ThreadModel) => number) => {
    const compare = comparator ?? ((a, b) => b.time - a.time);
    const next = [...threads].sort(compare);
    const current = this.threads.value;

    if (current.length !== next.length) {
      this.threads.value = next;
      return;
    }

    for (let i = 0; i < next.length; i++) {
      if (current[i] !== next[i]) {
        this.threads.value = next;
        return;
      }
    }
  }
}
