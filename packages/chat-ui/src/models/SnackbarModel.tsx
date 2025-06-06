import { ShowAlertParams } from "./ShowAlertParams";
import { ObservableReactValue } from "../utils/observers";

class SnackbarModel {
  readonly open = new ObservableReactValue(false);

  title = '';

  show = (params: ShowAlertParams) => {
    this.title = params.text;
    this.open.value = true;
  }

  close = () => {
    this.open.value = false;
  }

  constructor(callback?: (params: ShowAlertParams) => void) {
    if (callback) {
      this.show = callback;
    }
  }
}

export default SnackbarModel;
