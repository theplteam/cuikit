import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { IdType } from '../types';
import { MessageReasoningModel } from './MessageReasoningModel';
import { randomInt } from '../utils/numberUtils/randomInt';
import { MessageText } from './MessageText';
import { arrayLast } from '../utils/arrayUtils/arrayLast';

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

// TODO: Should be "external", because it's a type of message that we return to the user in their format
export type InternalMessageType = any;

export type MessageUserContent = string | (ImageContent | TextContent)[];
export type MessageAssistantContent = string | (TextContent)[];

export type Message = {
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

export class MessageModel<DM extends Message = Message> {
  /**
   * Text of message that supports "observation", should you need to update the component immediately upon variable modification, perfect for React.useSyncExternalStore.
   */
  readonly texts = new ObservableReactValue<MessageText[]>([]);

  readonly rating = new ObservableReactValue<RatingType | undefined>(undefined);

  readonly reasoningManager = new MessageReasoningModel();

  images?: string[];

  /**
   * An observable flag indicating the start/finish of message typing.
   */
  typing = new ObservableReactValue(false);

  photoswipeContainerId = 'photoswipe-container-' + randomInt(100, 100000);

  constructor(private _data: DM) {
    if (typeof _data.content === 'string') {
      this.texts.value = [new MessageText(_data.content)];
    } else {
      const content = Array.isArray(_data.content) ? _data.content : [_data.content];
      this.texts.value = (content.filter(v => v.type === 'text') as TextContent[]).map(
        (text) => new MessageText(text.text)
      );

      this.images = (content.filter(v => v.type === 'image_url') as ImageContent[])?.map((img) => img.image_url.url || '');
    }

    if (_data.rating) {
      this.rating.value = _data.rating;
    }

    if (_data.reasoning) {
      if (_data.reasoning.title) {
        this.reasoningManager.title.value = _data.reasoning.title;
      }

      if (_data.reasoning.text) {
        this.reasoningManager.text.value = _data.reasoning.text;
      }

      if (_data.reasoning.timeSec) {
        this.reasoningManager.timeSec.value = _data.reasoning.timeSec;
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
    let data: Message['content'] = this.text;

    if (this.images?.length) {
      const imgContent: ImageContent[] = this.images.map((img) => ({ type: 'image_url', image_url: { url: img } }));
      data = [...imgContent, { type: 'text', text: this.text }] ;
    }

    return data;
  }

  get text() {
    return arrayLast(this.texts.value)?.text ?? '';
  }

  set text(value: string) {
    const textModel = arrayLast(this.texts.value);
    if (textModel) {
      textModel.text = value;
    }
  }

  setId = (id: string) => {
    this._data.id = id;
  }
}
