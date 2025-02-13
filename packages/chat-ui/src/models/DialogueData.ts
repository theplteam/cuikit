import { DMessage } from './Message';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { IdType } from '../types';

export type DDialogue<DM extends DMessage = any> = {
  id: IdType;
  title: string;
  date?: string;
  authorId?: number;
  messages: DM[];
} & { isNew?: boolean };

export class DialogueData<DM extends DMessage, Data extends DDialogue<DM>> {
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

  get authorId() {
    return this.data.authorId;
  }

  get isNew() {
    return this.data.isNew;
  }

  // сделать копию объекта. Внимание! Не все данные актуальные
  copyData = () => ({
    ...this.data,
    title: this.title,
  });
}
