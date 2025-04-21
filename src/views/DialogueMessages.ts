import { Message } from '@plteam/chat-ui';

type ParentMapValue = { messages: Message[] };

const rootMessageHash = 'rootMessage';

export class DialogueMessages {

  getBranch = (messages: Message[], startFrom: Message | undefined) => {
    const messagesCopy = [...messages];
    const map = new Map(Object.entries(this._createNewMap(messages)));

    const rootMessages = startFrom ? [startFrom] : map.get(rootMessageHash)?.messages ?? [];

    const branches: Message[][] = [];

    for (const rootMessage of rootMessages) {
      branches.push(this._getBranchRecursive(rootMessage, map));
    }

    const topItems = branches.map(b => b[b.length - 1])
      .filter(Boolean);

    const topItem = topItems[topItems.length - 1];

    return topItem?.parentId ? this._createTree(topItem, messagesCopy) : [];
  }

  private _getBranchRecursive = (parent: Message, map: Map<string, ParentMapValue>) => {
    const branch = [parent];

    const parentMap = map.get(parent.id as string);

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
    // messages = sortByDesc([...messages], 'time');
    messages = [...messages].reverse();

    const newerMessageParentId = lastItem?.parentId;

    let userMessage = messages.find(m => m.id === newerMessageParentId);

    console.log(messages, userMessage, newerMessageParentId);

    const branch: Message[] = [];

    // console.log({ lastText: lastItem.text, lastId: lastItem.id, pid: lastItem.parentId }, { parentText: userMessage?.text, id: userMessage?.id });
    while (userMessage) {
      const currentMessages = messages.filter(
        m => m.role !== 'user' && m.parentId === userMessage?.id
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
}
