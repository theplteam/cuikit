import { onShowAlertType } from "../types/onShowAlertType";
import { ObservableReactValue } from "../utils/observers";

class SnackbarModel {
  readonly open = new ObservableReactValue(false);

  title = '';

  show: onShowAlertType = (text: string) => {
    this.title = text;
    this.open.value = true;
  }

  close = () => {
    this.open.value = false;
  }

  constructor(callback?: onShowAlertType) {
    if (callback) {
      this.show = callback;
    }
  }
}

export default SnackbarModel;
