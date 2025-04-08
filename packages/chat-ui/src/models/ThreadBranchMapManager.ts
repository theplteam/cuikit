import { Message, MessageModel } from './MessageModel';
import { IdType } from '../types';
import { isDefined } from '../utils/isDefined';

const rootMessageHash = 'rootMessage';

export type MesagesMapType<DM extends Message> = Map<IdType, { messages: MessageModel<DM>[] }>;

/**
 * TODO: Created in case the user needs to build a message tree in their own way
 */
export class ThreadBranchMapManager {
  private _mapObject: Record<IdType, IdType[]> = {};

  pushValue = (messageId: IdType, parentId: IdType | undefined) => {
    if (!parentId) {
      parentId = rootMessageHash;
    }

    if (!this._mapObject[parentId]) {
      this._mapObject[parentId] = [];
    }

    this._mapObject[parentId].push(messageId);
  }

  createDefaultMap = (messages: Readonly<MessageModel[]>) => {
    this.clear();

    for (const message of messages) {
      this.pushValue(message.id, message.parentId);
    }
    return this;
  }

  getMap = <DM extends Message>(messages: Readonly<MessageModel<DM>[]>) => {
    const map: MesagesMapType<DM> = new Map();

    for (const parentId in this._mapObject) {
      const parentMessages = this._mapObject[parentId]
        .map(id => messages.find(m => m.id === id))
        .filter(isDefined);

      map.set(parentId, { messages: parentMessages });
    }

    return map;
  }

  clear = () => {
    this._mapObject = {};
  }
}
