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

export type StreamMessageFnType = (text: string, userMessage: Message, assistantMessage: Message) => Promise<void | boolean | string | number>;

export abstract class DialogueAbstract<Data extends DDialogue = DDialogue> {
  /*@observable.shallow
  private readonly _messages: ChatMessage[] = [];*/

  readonly messages = new DialogueMessages();

  readonly data: DialogueData<Data>;

  readonly isTyping = new ObservableReactValue(false);

  readonly isEmpty = new ObservableReactValue(false);

  readonly streamStatus = new ObservableReactValue<StreamResponseState | undefined | string>(undefined);

  closeConnection?: () => void;

  scrollY = -1;

  private _dialogCreating?: ApiMethodPromise<{ dialogue: DDialogue }>;

  // диалог уже создан на сервере, но пользователь ещё не отправил ни одного сообщения.
  // Установим этот ID сразу после отправки сообщения
  private potentialId?: IdType;

  readonly timestamp: ObservableReactValue<number>;

  abstract streamMessage: StreamMessageFnType;

  protected abstract stopStreaming: () => void;

  protected readonly messageFactory: (data: DMessage) => Message;

  constructor(
    _data: Data,
    messageFactory?: (data: DMessage) => Message,
  ) {
    this.data = new DialogueData(_data);

    this.messageFactory = messageFactory ?? ((data) => new Message(data));

    const messages = sortBy(_data.messages.map(v => this.messageFactory(v)), 'time');

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
      role: message.owner,
      content: message.text,
    }));
  }

  createInstance = async (method: () => ApiMethodPromise<{ dialogue: DDialogue }>) => {
    let res: { data?: { dialogue: DDialogue } } | undefined;

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
    messageEdit: Message,
    newText: string,
  ) => {
    const parentMessage = this.messagesArray.find(v => v.id === messageEdit.parentId);
    this.isTyping.value = true;

    const { userMessage, assistantMessage } = this._createPair(newText, parentMessage);

    this.messages.push(userMessage, assistantMessage);

    const promise = this.streamMessage(newText, userMessage, assistantMessage);

    promise.then(() => {
      this.isTyping.value = false;
      this.isEmpty.value = false;
      this.closeConnection = undefined;
    });

    this.closeConnection = this.stopStreaming;

    return userMessage;
  }

  sendMessage = (
    lastMessage: Message | undefined,
    text: string,

  ) => {
    this.isTyping.value = true;

    const { userMessage, assistantMessage } = this._createPair(text, lastMessage);

    this.messages.push(userMessage, assistantMessage);

    const promise = this.streamMessage(text, userMessage, assistantMessage);

    promise.then(() => {
      this.isTyping.value = false;
      this.closeConnection = undefined;
    });

    this.closeConnection = this.stopStreaming;

    return promise;
  }

  protected _createPair = (text: string, parentMessage: Message | undefined) => {
    const userMessage = this.messageFactory({
      id: uuidv4(),
      text,
      owner: ChatMessageOwner.USER,
      userId: ChatApp.userId ?? '0',
      time: moment().unix(),
      parentId: parentMessage?.id,
    });

    const assistantMessage = this.messageFactory({
      id: 'NEW_MESSAGE_' + randomId(),
      text: '',
      owner: ChatMessageOwner.ASSISTANT,
      // должно быть больше для правильной сортировки
      time: moment().unix() + 1,
      parentId: userMessage.id,
    });

    return {
      userMessage, assistantMessage,
    };
  }
}
