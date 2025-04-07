import { Message, MessageModel } from './MessageModel';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { arrayLast } from '../utils/arrayUtils/arrayLast';

type BundleBranchType<DM extends Message> = (messages: MessageModel<DM>[], startFrom?: MessageModel<DM>) => MessageModel<DM>[]

export class ThreadMessages<DM extends Message> {
  private isEnabled = false;

  private bundleBranch?: BundleBranchType<DM>;

  allMessages = new ObservableReactValue<MessageModel<DM>[]>([]);

  currentMessages = new ObservableReactValue<MessageModel<DM>[]>([]);

  get allMessagesArray() {
    return this.allMessages.value;
  }

  // Remember which branch we stopped at, so that upon re-entering the thread, reopens it
  private _lastMessage?: MessageModel<DM>;

  private _callbackInitiated = false;

  init = (enableBranches: boolean = false, userBundleBranch?: BundleBranchType<DM>) => {
    if (this._callbackInitiated) return;

    this.isEnabled = enableBranches;
    if (enableBranches) {
      this.bundleBranch = userBundleBranch ?? this._bundleBranch;

      const branch = this.bundleBranch(this.allMessagesArray, this._lastMessage ?? arrayLast(this.allMessagesArray));
      this._updateBranch(branch);
    } else {
      this.currentMessages.setValue(this.allMessagesArray);
    }

    // reaction to adding to the array of all messages to update the thread
    this.allMessages.subscribe(() => {
      const newBranch = this.bundleBranch?.(this.allMessagesArray, arrayLast(this.allMessagesArray)) ?? this.allMessagesArray;
      this._updateBranch(newBranch);
    });
  }

  changeBranchesStatus = () => {
    if(!this.isEnabled) return;
    const branch = this.bundleBranch?.(this.allMessagesArray, this._lastMessage);
    this._updateBranch(branch);
  }

  handleChangeBranch = (message: MessageModel<DM>) => {
    if(!this.isEnabled) return;
    const branch = this.bundleBranch?.(this.allMessagesArray, message);
    this._updateBranch(branch);
  }

  private _updateBranch = (branch?: MessageModel<DM>[]) => {
    if (!branch) return;
    this.currentMessages.setValue(branch);
    this._lastMessage = arrayLast(branch);
  }

  private _bundleBranch: BundleBranchType<DM> = (messages, startFrom = this._lastMessage) => {
    if (!startFrom) return messages;

    const resultBefore: MessageModel<DM>[] = [];
    const resultAfter: MessageModel<DM>[] = [];
    const buildBefore = (message: MessageModel<DM>) => {
      if (startFrom?.id !== message.id) resultBefore.push(message);
      if (message.parentId) {
        const parentMessage = messages.find(msg => msg.id === message.parentId);
        if (parentMessage) {
          buildBefore(parentMessage);
        }
      }
    }

    const buildAfter = (message: MessageModel<DM>) => {
      if (startFrom?.id !== message.id) resultAfter.push(message);
      const child = messages.find(msg => msg.parentId === message?.id);
      if (child) buildAfter(child);
    }

    buildBefore(startFrom);
    buildAfter(startFrom);

    const branch: MessageModel<DM>[] = [];

    if (resultBefore.length) branch.push(...resultBefore.reverse());
    branch.push(startFrom);
    if (resultAfter.length) branch.push(...resultAfter);

    return branch;
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
