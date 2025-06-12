import { Thread } from "../../../models/ThreadData";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";

class ThreadListModel {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);
}

export default ThreadListModel;
