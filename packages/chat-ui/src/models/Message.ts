import { ForceStream } from './stream/ForceStream';
import { lng } from '../utils/lng';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { UserIdType } from './ChatApp';
import { IdType } from 'types';

export enum ChatMessageOwner {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum StreamResponseState {
  START = 'start',
  ANALYZING_DATASET = 'analyzingDataset',
  CREATE_DATASET = 'createDataset',
  PREPARING_ANSWER = 'preparingAnswer',
  TYPING_MESSAGE = 'typingMessage',
  FINISH_MESSAGE = 'finishMessage',
}

export type DMessage = {
  id: IdType;
  text: string;
  owner: ChatMessageOwner;
  userId?: UserIdType;
  info?: string;
  parentId?: IdType;
  time: number;
}

export class Message {
  readonly observableText = new ObservableReactValue('');

  typing = new ObservableReactValue(false);

  streamState = new ObservableReactValue<StreamResponseState | undefined>(undefined);

  messageFilters?: string;

  // для долгих ожиданий заранее на сервере генерируем заголовки, типа чат размышляет, а тут через таймаут их показываем
  /*@observable
  streamCurrentHeader?: string;
  private streamHeaders: string[] = [];
  private headersTimeout?: NodeJS.Timeout;*/

  constructor(private _data: DMessage) {
    this.observableText.value = _data.text;
    this.messageFilters = _data.info;
  }

  get id() {
    return this._data.id;
  }

  get parentId() {
    return this._data.parentId;
  }

  set parentId(val: IdType|undefined) {
    this._data.parentId = val;
  }

  get time() {
    return this._data.time;
  }

  get owner() {
    return this._data.owner;
  }

  get isUser() {
    return this.owner === ChatMessageOwner.USER;
  }

  get isAssistant() {
    return this.owner === ChatMessageOwner.ASSISTANT;
  }

  /*get user() {
    return this._data.userName ?? this._data.userId === appModel.user.id
      ? appModel.user
      : undefined;
  }*/

  get text() {
    return this.observableText.value;
  }

  set text(value: string) {
    this.observableText.value = value;
  }

  setId = (id: string) => {
    this._data.id = id;
  }

  /*setStreamHeaders = (headers: string[]) => {
    this.streamHeaders = headers;
    if (this.headersTimeout) clearTimeout(this.headersTimeout);
    this.processHeaders(true);
  }

  private processHeaders = (isFirst = false) => {
    if (this.streamHeaders.length && this.streamState === StreamResponseState.ANALYZING_DATASET) {
      this.headersTimeout = setTimeout(() => {
        this.streamCurrentHeader = this.streamHeaders[0];
        this.streamHeaders.splice(0, 1);
        this.processHeaders();
      }, isFirst ? randomInt(1000, 2500) : randomInt(3000, 6000));
    }
  }*/

  onError = (code: number) => {
    let text = [
      'К сожалению, произошла какая-то ошибка. Попробуйте задать вопрос повторно или изменить его',
      'Unfortunately, an error has occurred. Please try asking the question again or rephrase it.'
    ];

    if (code === 402) {
      text = [
        'К сожалению, у вас недостаточно токенов для работы с чатом. свяжитесь администратором, чтобы пополнить лимит',
        'Unfortunately, you do not have enough tokens to use the chat. Please contact admin to increase your limit.'
      ];
    }

    this.typing.value = false;
    this.streamState.value = StreamResponseState.FINISH_MESSAGE;
    // this.streamHeaders = [];
    this.text = '';
    const stream = new ForceStream(lng(text), this);
    stream.start();
  }
}
