import { randomId } from '../../utils/numberUtils/randomInt';

type CallbackFnType = () => void;

export class ObservableReactValue<T> {
  private _listeners: { key: string, fn: CallbackFnType }[] = [];

  constructor(private _value: T, public debug = false) {}

  get value(): Readonly<T> {
    return this._value;
  }

  set value(newValue: T) {
    this.setValue(newValue);
  }

  setValue(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      // if (this.debug) console.log('set new messages', newValue);
      this._listeners.map(v => v.fn());
    }
  }

  getSnapshot = () => this.value;

  subscribe = (callback: CallbackFnType) => {
    const key = `key${randomId()}`;

    this._listeners.push({ key, fn: callback });

    return () => {
      const index = this._listeners.findIndex(v => v.key === key);
      if (index >= 0) {
        this._listeners.splice(index, 1);
      }
    }
  }
}
