import { Thread } from "../../../models/ThreadModel";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";

class HistoryModel {
  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);

  setMenuDriverOpen = (v: boolean) => {
    this.menuDriverOpen.value = v;
  }

  setDeleteItem = (v: Thread | undefined) => {
    this.deleteItem.value = v;
  }
};

export default HistoryModel;
