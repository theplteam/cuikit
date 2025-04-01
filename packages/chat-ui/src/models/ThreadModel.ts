import { MessageModel, ChatMessageOwner, Message, MessageUserContent, MessageAssistantContent } from './MessageModel';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ThreadMessages } from './ThreadMessages';
import { Thread, ThreadData } from './ThreadData';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { randomId } from '../utils/numberUtils/randomInt';
import { MessageSender } from './MessageSender';
import { AdapterType } from 'views/adapter/AdapterType';

export type NewMessageResponse = {
  user: Message,
  assistant: Message,
};

export enum StreamResponseState {
  START = 'start',
  TYPING_MESSAGE = 'typingMessage',
  FINISH_MESSAGE = 'finishMessage',
}

export type ThreadHistoryItemType = { role: ChatMessageOwner.USER, content: MessageUserContent }
  | { role: ChatMessageOwner.ASSISTANT, content: MessageAssistantContent }

export type MessageSentParams<DM extends Message = any, DD extends Thread<DM> = any> = {
  /** Thread */
  thread: ThreadData<DM, DD>,
  /** User's message content */
  content: Message['content'],
  /** User's message */
  message: DM,
  /** Assistant's message */
  assistantMessage: DM,
  /** Thread history */
  history: ThreadHistoryItemType[],
  /**
   *  Pass a part of the received text from the chat (suitable if you are receiving the answer in streaming mode).
   *  Will be added to the current message.
   */
  pushChunk: (chunk: string) => void,
  /** Update text message  */
  setText: (text: string) => void,
  /** Assistant's response answer is complete. */
  onFinish: () => { userMessage: Message, assistantMessage: Message },
  /** Set awaiting status */
  setStatus: (status: string) => void,
  /** Options for managing reasoning. */
  reasoning: {
    /** Push part of text to the previous text */
    pushChunk: (reasoning: string) => void,
    /** Replace full text */
    setFull: (reasoning: string) => void,
    /**
     * Set the time spent on reasoning.
     * This will lock automatic time managment. To unlock, call the unlock method.
     */
    setTimeSec: (timeSec: number) => void,
    /**
     * Set current reasoning header.
     * This will lock automatic headers. To unlock, call the unlock method.
     */
    setTitle: (title: string) => void,
    /**
     * Set current reasoning header.
     * This will lock automatic headers. To unlock, call the unlock method.
     */
    setViewType: (viewType: 'stream' | 'headlines') => void,
    /**
     * Unlock auto managment for locked options (after calling the setHeader, setTimeSec, etc.)
     */
    unlockAutoManagement: (options?: ('headers' | 'time' | 'viewType')[]) => void,
  }
}

export class ThreadModel<DM extends Message = any, DD extends Thread<DM> = any> {
  /*@observable.shallow
  private readonly _messages: ChatMessage[] = [];*/

  readonly messages = new ThreadMessages<DM>();

  readonly data: ThreadData<DM, DD>;

  readonly isTyping = new ObservableReactValue(false);

  readonly isEmpty = new ObservableReactValue(false);

  readonly streamStatus = new ObservableReactValue<StreamResponseState | undefined | string>(undefined);

  scrollY = -1;

  // private _threadCreating?: ApiMethodPromise<{ thread: DD }>;

  // диалог уже создан на сервере, но пользователь ещё не отправил ни одного сообщения.
  // Установим этот ID сразу после отправки сообщения
  // private potentialId?: IdType;

  readonly timestamp: ObservableReactValue<number>;

  constructor(
    _data: DD,
    public readonly streamMessage: (params: MessageSentParams<DM>) => void | Promise<void>,
    readonly adapter?: AdapterType,
  ) {
    this.data = new ThreadData(_data);

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

    this.messages.allMessages.value = _data.messages.map(v => new MessageModel(v));

    this.isEmpty.value = !!_data.isNew;
    this.timestamp = new ObservableReactValue(moment(_data.date).unix());
  }

  get id() {
    return this.data.id;
  }

  get time() {
    return this.timestamp.value ?? 0;
  }

  get title() {
    return this.data.title;
  }

  get messagesArray() {
    return this.messages.allMessagesArray;
  }

  get isOwner() {
    return true;
    // return !!this.data.authorId && ChatApp.userId && this.data.authorId === ChatApp.userId;
  }

  /*createInstance = async (method: () => ApiMethodPromise<{ thread: DD }>) => {
    let res: { data?: { thread: DD } } | undefined;

    this._threadCreating = method();
    res = await this._threadCreating;

    // тут не нужно ставить id или менять страничку, т.к. диалог создается сразу как мы в него входим
    if (res?.data) {
      this.potentialId = res.data.thread.id;
    }

    this._threadCreating = undefined;
  }*/

  /**
   * Создать новый диалог
   */
  /*createIfEmpty = async () => {
    let created = false;

    if (this.isEmpty.value) {
      const createResult = await this._threadCreating;
      if (!this.potentialId && createResult?.data) {
        this.potentialId = createResult.data.thread.id;
      }

      if (this.potentialId) {
        this.data.setId(this.potentialId);
        created = true;
      }
      this.isEmpty.value = false;
    }

    return created;
  }*/

  editMessage = (
    messageEdit: MessageModel<DM>,
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
    lastMessage: MessageModel<DM> | undefined,
    text: string,
    images?: string[],
  ) => {
    this.isTyping.value = true;

    let content: MessageUserContent = text;

    if (images?.length) {
      const imgContent: MessageUserContent = images.map((img) => ({ type: 'image_url', image_url: { url: img } }));
      content = [...imgContent, { type: 'text', text: text,}]
    }

    const { userMessage, assistantMessage } = this._createPair(content, lastMessage);

    this.messages.push(userMessage, assistantMessage);

    const promise = this._sendMessage(content, userMessage, assistantMessage);

    promise.then(() => {
      this.isTyping.value = false;
    });

    return promise;
  }

  private _sendMessage = (content: Message['content'], userMessage: MessageModel<DM>, assistantMessage: MessageModel<DM>) => {
    const messageSender = new MessageSender(
      content,
      userMessage,
      assistantMessage,
      this,
    );

    return new Promise<{ message: Message }>((resolve, reject) => {
      const res = this.streamMessage(messageSender.getUserParams(resolve));

      if (res instanceof Promise) {
        res
          .then(() => {
            messageSender.changeTypingStatus(false);
            assistantMessage.reasoningManager.updateTimeSec();
            resolve({ message: userMessage.data });
          })
          .catch((reason) => {
            messageSender.changeTypingStatus(false);
            reject(reason);
          });
      }
    });
  }

  static createEmptyData = <DD>() => {
    return ({
      id: 'NEW_THREAD_' + randomId(),
      title: 'New thread',
      date: (new Date()).toISOString(),
      authorId: 0,
      messages: [],
      isNew: true,
    }) as DD;
  }

  protected _createPair = (content: Message['content'], parentMessage: MessageModel<DM> | undefined) => {
    const userMessage = new MessageModel({
      id: uuidv4(),
      content,
      role: ChatMessageOwner.USER,
      time: moment().unix(),
      parentId: parentMessage?.id,
    } as DM);

    const assistantMessage = new MessageModel({
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
