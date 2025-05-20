import { Message } from './MessageModel';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { IdType } from '../types';

export type Thread<DM extends Message = any> = {
  id: IdType;
  title: string;
  date?: string;
  messages?: DM[];
} & { isNew?: boolean };

export class ThreadData<DM extends Message, Data extends Thread<DM>> {
  readonly observableTitle = new ObservableReactValue('');

  constructor(readonly data: Data) {
    this.observableTitle.value = data.title;
  }

  get id() {
    return this.data.id;
  }

  setId = (value: IdType) => {
    this.data.id = value;
  }

  get title() {
    return this.observableTitle.value;
  }

  set title(value) {
    this.observableTitle.value = value;
  }

  get date() {
    return this.data.date;
  }

  get isNew() {
    return this.data.isNew;
  }
}
