import { DMessage, MessageModel } from './MessageModel';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { arrayLast } from '../utils/arrayUtils/arrayLast';
import { isDefined } from '../utils/isDefined';
import { IdType } from '../types';


type ParentMapValue<DM extends DMessage> = { messages: MessageModel<DM>[] };

type MesagesMapType<DM extends DMessage> = Map<IdType, ParentMapValue<DM>>;

const rootMessageHash = 'rootMessage';

export class ThreadMessages<DM extends DMessage> {
  allMessages = new ObservableReactValue<MessageModel<DM>[]>([], true);

  currentMessages = new ObservableReactValue<MessageModel<DM>[]>([]);

  get allMessagesArray() {
    return this.allMessages.value;
  }

  // Remember which branch we stopped at, so that upon re-entering the thread, reopens it
  private _lastMessage?: MessageModel<DM>;

  private _callbackInitiated = false;

  init = (enableBranches?: boolean) => {
    if (this._callbackInitiated) return;

    const newObject = this._createNewMap(this.allMessagesArray);

    const map = new Map(Object.entries(newObject));

    this._updateBranch(map, this._lastMessage, enableBranches);

    // reaction to adding to the array of all messages to update the thread
    this.allMessages.subscribe(() => {
      const newObject = this._createNewMap(this.allMessagesArray);
      const map = new Map(Object.entries(newObject));

      this._updateBranch(map, arrayLast(this.allMessagesArray as MessageModel<DM>[]), enableBranches);
    });
  }

  changeBranchesStatus = (enableBranches: boolean) => {
    const newObject = this._createNewMap(this.allMessagesArray);

    const map = new Map(Object.entries(newObject));
    this._updateBranch(map, this._lastMessage, enableBranches);
  }

  handleChangeBranch = (message: MessageModel<DM>) => {
    const parentId = message.parentId ?? rootMessageHash;

    const newObject = this._createNewMap(this.allMessagesArray);
    const map = new Map<IdType, ParentMapValue<DM>>(Object.entries(newObject));
    map.set(parentId, { messages: [message] });
    // console.log(message, messagesParentMap);

    this._updateBranch(map, message, true);
  }

  private _updateBranch = (map: MesagesMapType<DM>, startFrom?: MessageModel<DM>, enableBranches?: boolean) => {
    if (enableBranches !== true) {
      this.currentMessages.setValue(this.allMessagesArray);
      return;
    }

    if (!startFrom) startFrom = this._lastMessage;
    const rootMessages = startFrom ? [startFrom] : map.get(rootMessageHash)?.messages ?? [];

    const branches: MessageModel<DM>[][] = [];

    for (const rootMessage of rootMessages) {
      branches.push(this._getBranchRecursive(rootMessage, map));
    }

    const topItems = branches.map(b => arrayLast(b))
      .filter(isDefined);

    const topItem = arrayLast(topItems);

    /*console.log(
      branches.length,
      sortByDesc(branches[0]?.slice() ?? [], 'time').map((v) => ({
        text: v.text,
        pid: v.parentId,
        id: v.id,
        time: v.time - 1734000000,
      }))
    );

    console.log(topItem, createTree(topItem, thread.messages));*/

    const newBranch = topItem?.parentId ? this._createTree(topItem, this.allMessagesArray) : this.allMessagesArray;

    this.currentMessages.setValue(newBranch);

    this._lastMessage = arrayLast(newBranch);

    return this._lastMessage;
  }

  private _getBranchRecursive = (parent: MessageModel<DM>, map: MesagesMapType<DM>) => {
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

  private _createTree = (lastItem: MessageModel<DM>, messages: Readonly<MessageModel<DM>[]>) => {
    const branch: MessageModel<DM>[] = [];

    let nextItem: MessageModel<DM> | undefined = lastItem;

    while (nextItem) {
      branch.push(nextItem);

      if (nextItem.parentId) {
        nextItem = messages.find(m => m.id === nextItem!.parentId);
      } else {
        nextItem = undefined;
      }
    }

    return branch.reverse();
  }

  private _createNewMap = (messages: Readonly<MessageModel<DM>[]>) => {
    const newObject: { [key: string]: ParentMapValue<DM> } = {};

    for (const message of messages) {
      const parentId = message.parentId ?? rootMessageHash;

      // console.log(message.id, message.text, parentId);
      if (!newObject[parentId]) newObject[parentId] = { messages: [] };
      newObject[parentId].messages.push(message);
    }

    return newObject;
  }

  push = (...newMessages: MessageModel<DM>[]) => {
    this.allMessages.setValue([
      ...this.allMessages.value,
      ...newMessages,
    ]);
  }

  get length() {
    return this.allMessages.value.length;
  }
}
