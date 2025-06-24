import { Threads } from "../../../models/Threads";
import { ObservableReactValue } from "../../../utils/observers/ObservableReactValue";

type InternalApiType = {
  model: Threads<any, any>,
  handleCreateNewThread?: () => any,
  onChangeCurrentThread?: (v: any) => void,
  onThreadDeleted?: (v: any) => void,
}

export class InternalApiModel {
  model: InternalApiType['model'];

  handleCreateNewThread: InternalApiType['handleCreateNewThread'];

  onChangeCurrentThread: InternalApiType['onChangeCurrentThread'];

  onThreadDeleted: InternalApiType['onThreadDeleted'];

  constructor(params: InternalApiType) {
    this.model = params.model;
    this.handleCreateNewThread = params.handleCreateNewThread;
    this.onChangeCurrentThread = params.onChangeCurrentThread;
    this.onThreadDeleted = params.onThreadDeleted;
  }
}

const internalApi = new ObservableReactValue<InternalApiModel | undefined>(undefined);

export default internalApi;
