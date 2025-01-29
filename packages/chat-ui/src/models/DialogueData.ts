import { DMessage } from 'models/Message';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { IdType } from '../types';

export type DDialogue = {
  id: IdType;
  title: string;
  date?: string;
  authorId: number;
  messages: DMessage[];
} & { isNew?: boolean };

export class DialogueData<Data extends DDialogue> {
  readonly observableTitle = new ObservableReactValue('');

  constructor(private data: Readonly<Omit<Data, 'messages'>> & { id: IdType }) {
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
