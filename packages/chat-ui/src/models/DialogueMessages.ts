import { ChatMessage } from './ChatMessage';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { PromiseUtils } from '../utils/PromiseUtils';
import { arrayLast } from '../utils/arrayUtils/arrayLast';
import { sortByDesc } from '../utils/arrayUtils/arraySort';
import { isDefined } from '../utils/isDefined';


type ParentMapValue = { messages: ChatMessage[] };

const rootMessageHash = 'rootMessage';

export class DialogueMessages {
  allMessages = new ObservableReactValue<ChatMessage[]>([], true);

  currentMessages = new ObservableReactValue<ChatMessage[]>([]);

  // Если нужно подождать пока новое сообщение появится в ветке
  private _newMessageProcess?: PromiseUtils<boolean>;

  get allMessagesArray() {
    return this.allMessages.value;
  }

  get newMessagePromise() {
    return this._newMessageProcess?.promise;
  }

  // запомнить в какой ветке остановились, чтобы при повторном входе в диалог снова открыть её
  private _lastMessage?: ChatMessage;

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

      this._updateBranch(map, arrayLast(this.allMessagesArray as ChatMessage[]));
      this._newMessageProcess?.resolve(true);
    });
  }

  handleChangeBranch = (message: ChatMessage) => {
    const parentId = message.parentId ?? rootMessageHash;

    const newObject = this._createNewMap(this.allMessagesArray);
    const map = new Map(Object.entries(newObject));
    map.set(parentId, { messages: [message] });
    // console.log(message, messagesParentMap);

    this._updateBranch(map, message);
  }

  startNewMessageProcess = () => {
    this._newMessageProcess = new PromiseUtils();
  }

  private _updateBranch = (map: Map<string, ParentMapValue>, startFrom?: ChatMessage) => {
    if (!startFrom) startFrom = this._lastMessage;
    const rootMessages = startFrom ? [startFrom] : map.get(rootMessageHash)?.messages ?? [];

    const branches: ChatMessage[][] = [];

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

  private _getBranchRecursive = (parent: ChatMessage, map: Map<string, ParentMapValue>) => {
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

  private _createTree = (lastItem: ChatMessage, messages: Readonly<ChatMessage[]>) => {
    messages = sortByDesc([...messages], 'time');

    let userMessage: ChatMessage | undefined;

    if (lastItem.isUser) {
      userMessage = lastItem;
    } else {
      const newerMessageParentId = lastItem?.parentId;

      userMessage = messages.find(m => m.id === newerMessageParentId);
    }

    const branch: ChatMessage[] = [];

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
    return branch
      // убираем артефакты, когда пользователь остановил ответ чата ещё до начала стрима и написал новое
      /*.filter((message, index) => {
        return !index || message.isUser !== branch[index - 1].isUser
      })*/
      // Возвращаем ветку в обратном порядке
      .reverse();
  }

  private _createNewMap = (messages: Readonly<ChatMessage[]>) => {
    const newObject: { [key: string]: ParentMapValue } = {};

    for (const message of messages) {
      const parentId = message.parentId ?? rootMessageHash;

      // console.log(message.id, message.text, parentId);
      if (!newObject[parentId]) newObject[parentId] = { messages: [] };
      newObject[parentId].messages.push(message);
    }

    return newObject;
  }

  push = (...newMessages: ChatMessage[]) => {
    this.allMessages.setValue([
      ...this.allMessages.value,
      ...newMessages,
    ]);
  }

  get length() {
    return this.allMessages.value.length;
  }
}
