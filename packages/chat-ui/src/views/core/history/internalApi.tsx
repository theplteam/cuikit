import { Threads } from "../../../models/Threads";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";

export type InternalApiType = {
  model: Threads<any, any>,
  handleCreateNewThread?: () => any,
  onChangeCurrentThread?: (v: any) => void,
  onThreadDeleted?: (v: any) => void,
}

const internalApi = new ObservableReactValue<InternalApiType | undefined>(undefined);

export default internalApi;
