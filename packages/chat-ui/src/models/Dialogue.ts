import { Message, ChatMessageOwner, DMessage } from './Message';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { DialogueMessages } from './DialogueMessages';
import { DDialogue, DialogueData } from './DialogueData';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { randomId } from '../utils/numberUtils/randomInt';
import { ChatApp } from './ChatApp';
import { sortBy } from '../utils/arrayUtils/arraySort';
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

export type DialogueLight = Dialogue<any, any>;

export type MessageStreamingParams<DM extends DMessage = any> = {
  /** User's message text */
  text: string,
  /** User's message */
  message: DM,
  /** Dialogue history */
  history: {
    role: 'user' | 'assistant',
    content: string,
  }[],
  /**
   *  Pass a part of the received text from the chat (suitable if you are receiving the answer in streaming mode).
   *  Will be added to the current message.
   */
  pushChunk: (chunk: string) => void,
  /** Update text message  */
  setText: (text: string) => void,
  /** Assistant's response answer is complete. */
  onFinish: () => void,
}

export class Dialogue<DM extends DMessage, DD extends DDialogue<DM>> {
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

    const messages = sortBy(_data.messages.map(v => new Message(v)), 'time');

    this.messages.allMessages.value = messages
      // убираем артефакты, когда пользователь остановил ответ чата ещё до начала стрима и написал новое
      .filter((message, index) => {
        const nextMessage = messages[index + 1];
        return !nextMessage || message.isUser !== nextMessage.isUser
      });
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
    return this.data.authorId === ChatApp.userId;
  }

  /**
   * For chat request body
   */
  get messagesFormatted() {
    return this.messages.currentMessages.value.map((message) => ({
      role: message.role,
      content: message.text,
    }));
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

  ) => {
    this.isTyping.value = true;

    const { userMessage, assistantMessage } = this._createPair(text, lastMessage);

    this.messages.push(userMessage, assistantMessage);

    const promise = this._sendMessage(text, userMessage, assistantMessage);

    promise.then(() => {
      this.isTyping.value = false;
    });

    return promise;
  }


  private _sendMessage = (text: string, userMessage: Message<DM>, assistantMessage: Message<DM>) => {
    return new Promise<void>((resolve) => {
      this.streamMessage({
        text,
        history: this.messages.currentMessages.value.map((message) => ({
          role: message.role,
          content: message.text,
        })),
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

  protected _createPair = (text: string, parentMessage: Message<DM> | undefined) => {
    const userMessage = new Message({
      id: uuidv4(),
      text,
      role: ChatMessageOwner.USER,
      userId: ChatApp.userId ?? '0',
      time: moment().unix(),
      parentId: parentMessage?.id,
    } as DM);

    const assistantMessage = new Message({
      id: 'NEW_MESSAGE_' + randomId(),
      text: '',
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
