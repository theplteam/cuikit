import { ChatMessage, ChatMessageOwner, DChatMessage } from './ChatMessage';
import { ChatSendMessage } from './ChatSendMessage';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { DialogueMessages } from './DialogueMessages';
import { DChatDialogue, DialogueData } from './DialogueData';
import { ObservableReactValue } from './observers/ObservableReactValue';
import { randomId } from '../utils/numberUtils/randomInt';
import { PartialExcept } from './types';

export type NewMessageResponse = {
  user: DChatMessage,
  assistant: DChatMessage,
};

type ApiMethodPromise<T> = Promise<{ data?: T }>

export class ChatDialogue {
  /*@observable.shallow
  private readonly _messages: ChatMessage[] = [];*/

  readonly messages = new DialogueMessages();

  readonly data: DialogueData;

  readonly isFull = true;

  readonly isTyping = new ObservableReactValue(false);

  readonly isEmpty = new ObservableReactValue(false);

  closeConnection?: () => void;

  scrollY = -1;

  private _dialogCreating?: ApiMethodPromise<{ dialogue: DChatDialogue }>;

  // диалог уже создан на сервере, но пользователь ещё не отправил ни одного сообщения.
  // Установим этот ID сразу после отправки сообщения
  private potentialId?: string;

  readonly timestamp: ObservableReactValue<number>;

  /**
   * @param _data
   * @param touch - Аналог touch в Laravel - просто обновить дату
   * @param options
   */
  constructor(
    _data: DChatDialogue,
    public touch: <T extends ChatDialogue>(dialogue: T) => void,
    readonly options: {
      openDialogue: <T extends ChatDialogue>(dialogue: T) => void,
      getUserId?: () => number;
      // Следующие функции для заглушек, т.е. временно
      // TODO: временно ANY, т.к. нам сюда вообще не надо передавать edit
      edit?: (newData: PartialExcept<DChatDialogue, 'id'>) => any,
      getMessageUrl: (type: DChatDialogue['dialogType']) => string,
      authCode: string,
    },
  ) {
    this.data = new DialogueData(_data);
    this.messages.allMessages.value = _data.messages.map(v => new ChatMessage(v));
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
    return this.data.authorId === this.options.getUserId?.();
  }

  edit = (newData: DChatDialogue) => {
    this.data.title = newData.title;
    this.data.tariffs = newData.tariffs;
    const { id, title, tariffs } = this.data;
    return this.options.edit?.({ id, title, tariffs });
  }

  createInstance = async (method: () => ApiMethodPromise<{ dialogue: DChatDialogue }>) => {
    let res: { data?: { dialogue: DChatDialogue } } | undefined;

    this._dialogCreating = method();
    res = await this._dialogCreating;

    // тут не нужно ставить id или менять страничку, т.к. диалог создается сразу как мы в него входим
    if (res?.data) {
      this.potentialId = res.data.dialogue.id;
      this.data.observableNewsCount.setValue({
        newsDataset: res.data.dialogue.newsDataset ?? 0,
        newsFound: res.data.dialogue.newsFound ?? 120,
      });
    }

    this._dialogCreating = undefined;
  }

  editMessage = (messageEdit: ChatMessage, newText: string) => {
    const parentMessage = this.messagesArray.find(v => v.id === messageEdit.parentId);
    this.isTyping.value = true;

    const { userMessage, assistantMessage } = this._createPair(newText, parentMessage);

    this.messages.push(userMessage, assistantMessage);

    const url = this.options.getMessageUrl(this.data.dialogType);

    const sendMessageController = new ChatSendMessage(this, userMessage, assistantMessage);
    const promise = sendMessageController.sendMessage(
      url,
      this.options.authCode,
      {
        message: newText,
        messageEditedId: messageEdit.id,
        messageId: userMessage.id,
        dialogueId: this.id,
        parentId: userMessage.parentId,
      });

    promise.then(() => {
      this.isTyping.value = false;
      this.isEmpty.value = false;
      this.closeConnection = undefined;
      this.touch(this);
    });

    this.closeConnection = sendMessageController.close;

    return userMessage;
  }

  sendMessage = async (lastMessage: ChatMessage | undefined, text: string) => {
    this.isTyping.value = true;

    const { userMessage, assistantMessage } = this._createPair(text, lastMessage);

    this.messages.push(userMessage, assistantMessage);

    // Если это новый диалог, подождем создание диалога, т.к. нам необходимо знать его id
    if (this.isEmpty.value) {
      const createResult = await this._dialogCreating;
      if (!this.potentialId && createResult?.data) {
        this.potentialId = createResult.data.dialogue.id;
      }

      if (this.potentialId) {
        this.data.setId(this.potentialId);
        this.options.openDialogue(this);
      }
    }

    const url = this.options.getMessageUrl(this.data.dialogType);

    const sendMessageController = new ChatSendMessage(this, userMessage, assistantMessage);

    const promise = sendMessageController.sendMessage(
      url,
      this.options.authCode,
      {
        message: text,
        messageId: userMessage.id,
        dialogueId: this.id,
        parentId: userMessage.parentId,
      });

    promise.then(() => {
      this.isTyping.value = false;
      this.closeConnection = undefined;
      this.isEmpty.value = false;
      this.touch(this);
    });

    this.closeConnection = sendMessageController.close;
  }

  private _createPair = (text: string, parentMessage: ChatMessage | undefined) => {
    const userMessage = new ChatMessage({
      id: uuidv4(),
      text,
      owner: ChatMessageOwner.USER,
      userId: this.options.getUserId?.(),
      time: moment().unix(),
      parentId: parentMessage?.id,
    });

    const assistantMessage = new ChatMessage({
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

  /**
   * Аналог touch в Laravel - просто обновить дату
   */
  /*private touch = () => {
    this.createdTimestamp = moment().unix();
    const list = appModel.chat.dialoguesList;

    appModel.chat.dialoguesList.dialoguesMap.set(
      this,
      {
        ...list.groups.today,
        timestamp: this.createdTimestamp,
      }
    );
  }*/
}
