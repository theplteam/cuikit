import { Message, MessageModel } from './MessageModel';
import { IdType } from '../types';
import { isDefined } from '../utils/isDefined';
import { arrayPluck } from '../utils/arrayUtils/arrayPluck';

const rootMessageHash = 'rootMessage';

export type MesagesMapType<DM extends Message> = Map<IdType, { messages: MessageModel<DM>[] }>;

/**
 * TODO: Created in case the user needs to build a message tree in their own way
 */
export class ThreadBranchMapManager<DM extends Message> {
  private _mapObject: Record<IdType, IdType[]> = {};

  private _map: MesagesMapType<DM> = new Map();

  private _currentMapId = '';

  private pushValue = (messageId: IdType, parentId: IdType | undefined) => {
    if (!parentId) {
      parentId = rootMessageHash;
    }

    if (!this._mapObject[parentId]) {
      this._mapObject[parentId] = [];
    }

    this._mapObject[parentId].push(messageId);
  }

  private createDefaultMap = (messages: Readonly<MessageModel<DM>[]>) => {
    this.clear();

    for (const message of messages) {
      this.pushValue(message.id, message.parentId);
    }
    return this;
  }

  createMap = (messages: Readonly<MessageModel<DM>[]>) => {
    const newMapId = arrayPluck(messages, 'id').join('-');
    if (newMapId === this._currentMapId) return this._map;

    this._currentMapId = newMapId;

    this.clear();

    this.createDefaultMap(messages);

    this._map = this.getMap(messages);

    return this._map;
  }

  private getMap = (messages: Readonly<MessageModel<DM>[]>) => {
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
    this._map = new Map();
    this._currentMapId = '';
  }
}
