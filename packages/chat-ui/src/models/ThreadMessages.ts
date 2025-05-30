import { InternalMessageType, Message, MessageModel } from './MessageModel';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { arrayLast } from '../utils/arrayUtils/arrayLast';
import { isDefined } from '../utils/isDefined';
import { MesagesMapType, ThreadBranchMapManager } from './ThreadBranchMapManager';

const rootMessageHash = 'rootMessage';

export type GetCurrentBranchFnType = (lastMessage: InternalMessageType) => Message[];

export class ThreadMessages<DM extends Message> {
  allMessages = new ObservableReactValue<MessageModel<DM>[]>([]);

  currentMessages = new ObservableReactValue<MessageModel<DM>[]>([]);

  internalMessageTransformer!: (message: MessageModel) => InternalMessageType;

  getCurrentBranchFn?: GetCurrentBranchFnType;

  private branchMapManager = new ThreadBranchMapManager<DM>();

  get allMessagesArray() {
    return this.allMessages.value;
  }

  // Remember which branch we stopped at, so that upon re-entering the thread, reopens it
  private _lastMessage?: MessageModel<DM>;

  private _callbackInitiated = false;

  init = (enableBranches?: boolean) => {
    if (this._callbackInitiated) return;

    const map = this._createNewMap(this.allMessagesArray);

    this._updateBranch(map, this._lastMessage, enableBranches);

    // reaction to adding to the array of all messages to update the thread
    this.allMessages.subscribe(() => {
      const map = this._createNewMap(this.allMessagesArray);

      this._updateBranch(map, arrayLast(this.allMessagesArray as MessageModel<DM>[]), enableBranches);
    });
  }

  changeBranchesStatus = (enableBranches: boolean) => {
    const map = this._createNewMap(this.allMessagesArray);

    this._updateBranch(map, this._lastMessage, enableBranches);
  }

  handleChangeBranch = (message: MessageModel<DM>) => {
    const parentId = message.parentId ?? rootMessageHash;

    const map = this._createNewMap(this.allMessagesArray);

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
    let newBranch: MessageModel<DM>[] = [];

    if (this.getCurrentBranchFn) {
      newBranch = this.getCurrentBranchFn(startFrom ? this.internalMessageTransformer(startFrom) : undefined)
        .map(v => this.allMessagesArray.find(m => m.id === v.id))
        .filter(isDefined);

    } else {
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

      newBranch = topItem?.parentId ? this._createTree(topItem, this.allMessagesArray) : this.allMessagesArray;
    }

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
    // not needed, since we don't use the map if getCurrentBranchFn provided
    if (this.getCurrentBranchFn) return new Map();
    return this.branchMapManager.createMap(messages);
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
