import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { UserIdType } from './ChatApp';
import { IdType } from '../types';

export enum ChatMessageOwner {
  USER = 'user',
  ASSISTANT = 'assistant',
}

type ImageContent = {
  type: 'image_url', 
  image_url: { url: string } 
}

type TextContent = {
  type: 'text',
  text: string,
}

export type ExtendedContentType = ImageContent | TextContent;

export type DMessage = {
  id: IdType;
  content: string | ExtendedContentType[];
  role: ChatMessageOwner | string;
  userId?: UserIdType;
  info?: string;
  parentId?: IdType;
  time: number;
}

export class Message<DM extends DMessage = any> {
  /**
   * Text of message that supports "observation", should you need to update the component immediately upon variable modification, perfect for React.useSyncExternalStore.
   */
  readonly observableText = new ObservableReactValue<string>('');

  image?: string;

  /**
   * An observable flag indicating the start/finish of message typing.
   */
  typing = new ObservableReactValue(false);

  /**
   * @deprecated
   */
  messageFilters?: string;

  constructor(private _data: DM) {
    if (Array.isArray(_data.content)) {
      this.observableText.value = _data.content.find(v => v.type === 'text')?.text || '';
      this.image = _data.content.find(v => v.type === 'image_url')?.image_url.url || ''
    } else {
      this.observableText.value = _data.content;
    }
    
    this.messageFilters = _data.info;
  }

  get id() {
    return this._data.id;
  }

  get data() {
    return this._data;
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

  get role() {
    return this._data.role;
  }

  get isUser() {
    return this.role === ChatMessageOwner.USER;
  }

  get isAssistant() {
    return this.role === ChatMessageOwner.ASSISTANT;
  }

  get content() {
    let data: DMessage['content'] = this.text;

    if (this.image) {
      data = [{ type: 'image_url', image_url: { url: this.image } }, {type: 'text', text: this.text}];
    }

    return data;
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

  /*onError = (code: number) => {
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
    // this.streamHeaders = [];
    this.text = '';
    const stream = new ForceStream(lng(text), this);
    stream.start();
  }*/
}
