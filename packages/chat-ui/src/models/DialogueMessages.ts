import { Message } from './Message';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { PromiseUtils } from '../utils/PromiseUtils';
import { arrayLast } from '../utils/arrayUtils/arrayLast';
import { sortByDesc } from '../utils/arrayUtils/arraySort';
import { isDefined } from '../utils/isDefined';
import { IdType } from '../types';


type ParentMapValue = { messages: Message[] };

type MesagesMapType = Map<IdType, ParentMapValue>;

const rootMessageHash = 'rootMessage';

export class DialogueMessages {
  allMessages = new ObservableReactValue<Message[]>([], true);

  currentMessages = new ObservableReactValue<Message[]>([]);

  // Если нужно подождать пока новое сообщение появится в ветке
  private _newMessageProcess?: PromiseUtils<boolean>;

  get allMessagesArray() {
    return this.allMessages.value;
  }

  get newMessagePromise() {
    return this._newMessageProcess?.promise;
  }

  // запомнить в какой ветке остановились, чтобы при повторном входе в диалог снова открыть её
  private _lastMessage?: Message;

  private _callbackInitiated = false;

  init = () => {
    if (this._callbackInitiated) return;

    const newObject = this._createNewMap(this.allMessagesArray);

    const map = new Map(Object.entries(newObject));

    this._updateBranch(map, this._lastMessage);

    // реакция на пополнение в массиве всех сообщений, чтобы обновить ветку
    this.allMessages.subscribe(() => {
      const newObject = this._createNewMap(this.allMessagesArray);
      const map = new Map(Object.entries(newObject));

      this._updateBranch(map, arrayLast(this.allMessagesArray as Message[]));
      this._newMessageProcess?.resolve(true);
    });
  }

  handleChangeBranch = (message: Message) => {
    const parentId = message.parentId ?? rootMessageHash;

    const newObject = this._createNewMap(this.allMessagesArray);
    const map = new Map<IdType, ParentMapValue>(Object.entries(newObject));
    map.set(parentId, { messages: [message] });
    // console.log(message, messagesParentMap);

    this._updateBranch(map, message);
  }

  startNewMessageProcess = () => {
    this._newMessageProcess = new PromiseUtils();
  }

  private _updateBranch = (map: MesagesMapType, startFrom?: Message) => {
    if (!startFrom) startFrom = this._lastMessage;
    const rootMessages = startFrom ? [startFrom] : map.get(rootMessageHash)?.messages ?? [];

    const branches: Message[][] = [];

    for (const rootMessage of rootMessages) {
      branches.push(this._getBranchRecursive(rootMessage, map));
    }

    const topItems = branches.map(b => sortByDesc(b.slice(), 'time')[0])
      .filter(isDefined);

    const topItem = sortByDesc(topItems, 'time')[0];

    /*console.log(
      branches.length,
      sortByDesc(branches[0]?.slice() ?? [], 'time').map((v) => ({
        text: v.text,
        pid: v.parentId,
        id: v.id,
        time: v.time - 1734000000,
      }))
    );

    console.log(topItem, createTree(topItem, dialogue.messages));*/

    const newBranch = topItem?.parentId ? this._createTree(topItem, this.allMessagesArray) : [];

    this.currentMessages.setValue(newBranch);

    this._lastMessage = arrayLast(newBranch);

    return this._lastMessage;
  }

  private _getBranchRecursive = (parent: Message, map: MesagesMapType) => {
    const branch = [parent];

    const parentMap = map.get(parent.id);

    if (parentMap) {
      // все ради цикла :)
      const darkness = parentMap.messages;

      for (const child of darkness) {
        branch.push(...this._getBranchRecursive(child, map));
      }
    }

    return branch;
  }

  private _createTree = (lastItem: Message, messages: Readonly<Message[]>) => {
    messages = sortByDesc([...messages], 'time');

    let userMessage: Message | undefined;

    if (lastItem.isUser) {
      userMessage = lastItem;
    } else {
      const newerMessageParentId = lastItem?.parentId;

      userMessage = messages.find(m => m.id === newerMessageParentId);
    }

    const branch: Message[] = [];

    // console.log({ lastText: lastItem.text, lastId: lastItem.id, pid: lastItem.parentId }, { parentText: userMessage?.text, id: userMessage?.id });
    while (userMessage) {
      const currentMessages = messages.filter(
        m => !m.isUser && m.parentId === userMessage?.id
      );

      // console.log(...[userMessage, ...currentMessages].map(v => ({ text: v.text, id: v.id, parentId: v.parentId })));
      // Добавление текущих сообщений и самого пользовательского сообщения в ветку
      branch.push(...currentMessages);
      branch.push(userMessage);

      // Переход к следующему пользовательскому сообщению в цепочке
      if (userMessage.parentId) {
        userMessage = messages.find(m => m.id === userMessage!.parentId);
      } else {
        userMessage = undefined;
      }
    }

    // Возвращаем ветку в обратном порядке
    return branch.reverse();
  }

  private _createNewMap = (messages: Readonly<Message[]>) => {
    const newObject: { [key: string]: ParentMapValue } = {};

    for (const message of messages) {
      const parentId = message.parentId ?? rootMessageHash;

      // console.log(message.id, message.text, parentId);
      if (!newObject[parentId]) newObject[parentId] = { messages: [] };
      newObject[parentId].messages.push(message);
    }

    return newObject;
  }

  push = (...newMessages: Message[]) => {
    this.allMessages.setValue([
      ...this.allMessages.value,
      ...newMessages,
    ]);
  }

  get length() {
    return this.allMessages.value.length;
  }
}
