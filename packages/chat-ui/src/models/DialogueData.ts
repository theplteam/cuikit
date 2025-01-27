import { DChatMessage } from './ChatMessage';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { MakeReadonlyValuesExcept } from './types';

export enum ChatDialogueTypeEnum {
  NEWS_LIST = 'newsList',
  NEWS_COLLECTION = 'newsCollection',
  SINGLE_NEWS = 'singleNews',
}

export type DChatDialogue = {
  id: string;
  title: string;
  date?: string;
  filters?: string;
  authorId: number;
  newsFound?: number;
  newsDataset?: number;
  usage?: number;
  messages: DChatMessage[];
  dialogType: ChatDialogueTypeEnum;
  tariffs?: number[];
} & { isNew?: boolean };

export class DialogueData {
  readonly observableTitle = new ObservableReactValue('');

  readonly observableNewsCount = new ObservableReactValue({
    newsFound: 0,
    newsDataset: 0,
  });

  constructor(private data: MakeReadonlyValuesExcept<Omit<DChatDialogue, 'messages'>, 'usage' | 'tariffs' | 'id' | 'filters'>) {
    this.observableTitle.value = data.title;
  }

  get id() {
    return this.data.id;
  }

  setId = (value: string) => {
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

  get filters() {
    return this.data.filters;
  }

  set filters(value) {
    this.data.filters = value;
  }

  get authorId() {
    return this.data.authorId;
  }

  get newsFound() {
    return this.data.newsFound;
  }

  get newsDataset() {
    return this.data.newsDataset;
  }

  get tokensUsage() {
    return this.data.usage ?? 0;
  }

  set tokensUsage(value) {
    this.data.usage = value;
  }

  get dialogType() {
    return this.data.dialogType;
  }

  get tariffs() {
    return this.data.tariffs;
  }

  set tariffs(value) {
    this.data.tariffs = value;
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
