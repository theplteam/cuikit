import { Threads } from "../../../models/Threads";
import { Thread } from "../../../models/ThreadModel";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";
import { Message } from "../../../models/MessageModel";

export class HistoryModel {
  readonly threadsModel = new ObservableReactValue<Threads<Message, Thread> | undefined>(undefined);

  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);

  setMenuDriverOpen = (v: boolean) => {
    this.menuDriverOpen.value = v;
  }

  setDeleteItem = (v: Thread | undefined) => {
    this.deleteItem.value = v;
  }
};

const historyModel = new HistoryModel();

export default historyModel;
