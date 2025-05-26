import { MessageModel, ChatMessageOwner, Message } from './MessageModel';
import moment from 'moment';
import { v4 as uuid, v4 as uuidv4 } from 'uuid';
import { ThreadMessages } from './ThreadMessages';
import { Thread, ThreadData } from './ThreadData';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { randomId } from '../utils/numberUtils/randomInt';
import { MessageSentParams } from './MessageSentParams';
import { IdType } from '../types';

export type NewMessageResponse = {
  user: Message,
  assistant: Message,
};

export enum StreamResponseState {
  START = 'start',
  TYPING_MESSAGE = 'typingMessage',
  THINKING = 'thinking',
  FINISH_MESSAGE = 'finishMessage',
}

export class ThreadModel<DM extends Message = any, DD extends Thread<DM> = any> {
  /*@observable.shallow
  private readonly _messages: ChatMessage[] = [];*/

  readonly viewerUniqueKey = uuid();

  readonly messages = new ThreadMessages<DM>();

  readonly data: ThreadData<DM, DD>;

  readonly isTyping = new ObservableReactValue(false);

  readonly isLoadingAttachments = new ObservableReactValue<IdType[]>([]);

  readonly isEmpty = new ObservableReactValue(false);

  readonly streamStatus = new ObservableReactValue<StreamResponseState | undefined | string>(undefined);

  /**
   * We can pass threads with empty history to improve performance
   * When opening such a thread, we need to call the getFullThread method to load the history
   */
  readonly isLoadingFullData = new ObservableReactValue(true);

  scrollY = -1;

  // private _threadCreating?: ApiMethodPromise<{ thread: DD }>;

  // диалог уже создан на сервере, но пользователь ещё не отправил ни одного сообщения.
  // Установим этот ID сразу после отправки сообщения
  // private potentialId?: IdType;

  readonly timestamp: ObservableReactValue<number>;

  constructor(
    _data: DD,
    public readonly streamMessage: (params: MessageSentParams) => void | Promise<void>,
  ) {
    this.data = new ThreadData(_data);
    this.streamStatus.value = StreamResponseState.FINISH_MESSAGE;

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

    this.messages.allMessages.value = _data.messages?.map(v => new MessageModel(v)) ?? [];

    this.isEmpty.value = !!_data.isNew;

    if (!!_data.messages?.length || _data.isNew) {
      this.isLoadingFullData.value = false;
    }

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

  setFullData = (threadData: Thread & { messages: DM[] }) => {
    this.messages.allMessages.value = threadData.messages?.map(v => new MessageModel(v)) ?? [];
    this.isLoadingFullData.value = false;
  }

  static createEmptyData = <DD>() => {
    return ({
      id: 'NEW_THREAD_' + randomId(),
      title: 'New thread',
      date: (new Date()).toISOString(),
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
