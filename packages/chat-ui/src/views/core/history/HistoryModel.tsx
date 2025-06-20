import { Thread } from "../../../models/ThreadModel";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";

class HistoryModel {
  readonly internalInitialized = new ObservableReactValue(false);

  readonly menuDriverOpen = new ObservableReactValue(false);

  readonly deleteItem = new ObservableReactValue<Thread | undefined>(undefined);
}

export default HistoryModel;
