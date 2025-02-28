import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { IdType } from '../types';

export enum ChatMessageOwner {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type RatingType = 'like' | 'dislike';

export type ImageContent = {
  type: 'image_url',
  image_url: { url: string }
}

export type TextContent = {
  type: 'text',
  text: string,
}

export type MessageUserContent = string | (ImageContent | TextContent)[];
export type MessageAssistantContent = string | (TextContent)[];

export type DMessage = {
  id: IdType;
  parentId?: IdType;
  time?: number;
  rating?: RatingType;
  reasoning?: {
    title?: string;
    text?: string;
    timeSec?: number;
  };
} & ({
  role: ChatMessageOwner.USER;
  content: MessageUserContent;
} | {
  role: ChatMessageOwner.ASSISTANT;
  content: MessageAssistantContent;
})

export class MessageModel<DM extends DMessage = any> {
  /**
   * Text of message that supports "observation", should you need to update the component immediately upon variable modification, perfect for React.useSyncExternalStore.
   */
  readonly observableText = new ObservableReactValue<string>('');

  readonly reasoningTitle = new ObservableReactValue<string>('');
  readonly reasoning = new ObservableReactValue<string>('');
  readonly reasoningTimeSec = new ObservableReactValue<number>(0);

  images?: string[];

  /**
   * An observable flag indicating the start/finish of message typing.
   */
  typing = new ObservableReactValue(false);

  constructor(private _data: DM) {
    if (typeof _data.content === 'string') {
      this.observableText.value = _data.content;
    } else {
      const content = Array.isArray(_data.content) ? _data.content : [_data.content];
      this.observableText.value = (content.find(v => v.type === 'text') as TextContent)?.text || '';
      this.images = (content.filter(v => v.type === 'image_url') as ImageContent[])?.map((img) => img.image_url.url || '');
    }

    if (_data.reasoning) {
      if (_data.reasoning.title) {
        this.reasoningTitle.value = _data.reasoning.title;
      }

      if (_data.reasoning.text) {
        this.reasoning.value = _data.reasoning.text;
      }

      if (_data.reasoning.timeSec) {
        this.reasoningTimeSec.value = _data.reasoning.timeSec;
      }
    }
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

  get rating() {
    return this._data.rating;
  }

  set rating(value) {
    this._data.rating = value;
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

    if (this.images?.length) {
      const imgContent: ImageContent[] = this.images.map((img) => ({ type: 'image_url', image_url: { url: img } }));
      data = [...imgContent, { type: 'text', text: this.text }] ;
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
