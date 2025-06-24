import { Threads } from "../../../models/Threads";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";

export type InternalApiType = {
  model: Threads<any, any>,
}

const internalApi = new ObservableReactValue<InternalApiType | undefined>(undefined);

export default internalApi;
