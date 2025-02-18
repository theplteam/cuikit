import { Message, ChatMessageOwner, DMessage, MessageUserContent, MessageAssistantContent } from './Message';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { DialogueMessages } from './DialogueMessages';
import { DDialogue, DialogueData } from './DialogueData';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { randomId } from '../utils/numberUtils/randomInt';
import { ChatApp } from './ChatApp';
import { IdType } from '../types';

export type NewMessageResponse = {
  user: DMessage,
  assistant: DMessage,
};

type ApiMethodPromise<T> = Promise<{ data?: T }>

export enum StreamResponseState {
  START = 'start',
  TYPING_MESSAGE = 'typingMessage',
  FINISH_MESSAGE = 'finishMessage',
}

export type DialogueHistoryItemType = { role: ChatMessageOwner.USER, content: MessageUserContent }
  | { role: ChatMessageOwner.ASSISTANT, content: MessageAssistantContent }

export type MessageStreamingParams<DM extends DMessage = any> = {
  /** User's message content */
  content: DMessage['content'],
  /** User's message */
  message: DM,
  /** Dialogue history */
  history: DialogueHistoryItemType[],
  /**
   *  Pass a part of the received text from the chat (suitable if you are receiving the answer in streaming mode).
   *  Will be added to the current message.
   */
  pushChunk: (chunk: string) => void,
  /** Update text message  */
  setText: (text: string) => void,
  /** Assistant's response answer is complete. */
  onFinish: () => void,
  setStatus: (status: string) => void,
}

export class Dialogue<DM extends DMessage = any, DD extends DDialogue<DM> = any> {
  /*@observable.shallow
  private readonly _messages: ChatMessage[] = [];*/

  readonly messages = new DialogueMessages<DM>();

  readonly data: DialogueData<DM, DD>;

  readonly isTyping = new ObservableReactValue(false);

  readonly isEmpty = new ObservableReactValue(false);

  readonly streamStatus = new ObservableReactValue<StreamResponseState | undefined | string>(undefined);

  scrollY = -1;

  private _dialogCreating?: ApiMethodPromise<{ dialogue: DD }>;

  // диалог уже создан на сервере, но пользователь ещё не отправил ни одного сообщения.
  // Установим этот ID сразу после отправки сообщения
  private potentialId?: IdType;

  readonly timestamp: ObservableReactValue<number>;

  constructor(
    _data: DD,
    public readonly streamMessage: ((params: MessageStreamingParams<DM>) => void
      ),
  ) {
    this.data = new DialogueData(_data);

    /*if (!_data.messages.find(v => !!v.parentId)) {
      const newMessages: DD['messages'] = [];

      let parentId: IdType | undefined = undefined;
      _data.messages.forEach(v => {
        newMessages.push({
          ...v,
          parentId,
        });
        if (v.role === ChatMessageOwner.USER) {
          parentId = v.id;
        }
      });

      _data.messages = newMessages
    }*/

    this.messages.allMessages.value = _data.messages.map(v => new Message(v));

    this.isEmpty.value = !!_data.isNew;
    this.timestamp = new ObservableReactValue(moment(_data.date).unix());
  }

  get id() {
    return this.data.id;
  }

  get title() {
    return this.data.title;
  }

  get messagesArray() {
    return this.messages.allMessagesArray;
  }

  get isOwner() {
    return !!this.data.authorId && ChatApp.userId && this.data.authorId === ChatApp.userId;
  }

  createInstance = async (method: () => ApiMethodPromise<{ dialogue: DD }>) => {
    let res: { data?: { dialogue: DD } } | undefined;

    this._dialogCreating = method();
    res = await this._dialogCreating;

    // тут не нужно ставить id или менять страничку, т.к. диалог создается сразу как мы в него входим
    if (res?.data) {
      this.potentialId = res.data.dialogue.id;
    }

    this._dialogCreating = undefined;
  }

  /**
   * Создать новый диалог
   */
  createIfEmpty = async () => {
    let created = false;

    if (this.isEmpty.value) {
      const createResult = await this._dialogCreating;
      if (!this.potentialId && createResult?.data) {
        this.potentialId = createResult.data.dialogue.id;
      }

      if (this.potentialId) {
        this.data.setId(this.potentialId);
        created = true;
      }
      this.isEmpty.value = false;
    }

    return created;
  }

  editMessage = (
    messageEdit: Message<DM>,
    newText: string,
  ) => {
    const parentMessage = this.messagesArray.find(v => v.id === messageEdit.parentId);
    this.isTyping.value = true;

    const { userMessage, assistantMessage } = this._createPair(newText, parentMessage);

    this.messages.push(userMessage, assistantMessage);

    const promise = this._sendMessage(newText, userMessage, assistantMessage);

    promise.then(() => {
      this.isTyping.value = false;
      this.isEmpty.value = false;
    });

    return userMessage;
  }

  sendMessage = (
    lastMessage: Message<DM> | undefined,
    text: string,
    image?: string,
  ) => {
    this.isTyping.value = true;

    let content: DMessage['content'] = text;

    if (image) {
      content = [{
        type: 'image_url',
        image_url: { url: image }
      },
      {
        type: 'text',
        text: text,
      }]
    }

    const { userMessage, assistantMessage } = this._createPair(content, lastMessage);

    this.messages.push(userMessage, assistantMessage);

    const promise = this._sendMessage(content, userMessage, assistantMessage);

    promise.then(() => {
      this.isTyping.value = false;
    });

    return promise;
  }


  private _sendMessage = (content: DMessage['content'], userMessage: Message<DM>, assistantMessage: Message<DM>) => {
    return new Promise<void>((resolve) => {
      this.streamMessage({
        content,
        history: this.messages.currentMessages.value.map((message) => ({
          role: message.role,
          content: message.content,
        }) as DialogueHistoryItemType),
        message: userMessage.data,
        setText: (text) => {
          assistantMessage.text = text;
        },
        pushChunk: (chunk) => {
          if (this.streamStatus.value !== StreamResponseState.TYPING_MESSAGE) {
            this.streamStatus.value = StreamResponseState.TYPING_MESSAGE;
          }
          assistantMessage.text += chunk;
        },
        onFinish: () => {
          resolve();
        },
        setStatus: (status) => {
          this.streamStatus.value = status;
        }
      });
    });
  }

  static createEmptyData = <DD>() => {
    return ({
      id: 'NEW_DIALOGUE_' + randomId(),
      title: '',
      date: '',
      authorId: 0,
      messages: [],
      isNew: true,
    }) as DD;
  }

  protected _createPair = (content: DMessage['content'], parentMessage: Message<DM> | undefined) => {
    const userMessage = new Message({
      id: uuidv4(),
      content,
      role: ChatMessageOwner.USER,
      time: moment().unix(),
      parentId: parentMessage?.id,
    } as DM);

    const assistantMessage = new Message({
      id: 'NEW_MESSAGE_' + randomId(),
      content: '',
      role: ChatMessageOwner.ASSISTANT,
      // должно быть больше для правильной сортировки
      time: moment().unix() + 1,
      parentId: userMessage.id,
    } as DM);

    return {
      userMessage, assistantMessage,
    };
  }
}
