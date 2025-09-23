import {
  ThreadModel,
  TextContent,
  MessageUserContent,
  MessageModel,
  ChatMessageOwner,
  InternalMessageType,
} from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { ChatUsersProps } from '../core/useChatProps';
import { Threads } from '../../models/Threads';
import { useAdapterContext, useInternalMessageTransformer } from '../adapter/AdapterContext';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';
import { randomId } from '../../utils/numberUtils/randomInt';
import { MessageSender } from '../../models/MessageSender';
import { ApiManager } from '../core/useApiManager';

type BeforeUserMessageSendFnParams = {
  text: string;
  content: MessageUserContent;
  history: InternalMessageType[];
  reason: 'editMessage' | 'newMessage';
  parentMessage?: InternalMessageType;
};

export type BeforeUserMessageSendFnType = (params: BeforeUserMessageSendFnParams) => {
  userMessage?: InternalMessageType;
  assistantMessage?: InternalMessageType;
} | Promise<{
  userMessage?: InternalMessageType;
  assistantMessage?: InternalMessageType;
}>;

export const useThreadSendMessage = (
  thread: ThreadModel | undefined,
  model: Threads<any, any>,
  onFirstMessageSent: ChatUsersProps<any, any>['onFirstMessageSent'],
  beforeUserMessageSend: BeforeUserMessageSendFnType | undefined,
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller: {
    handleBottomScroll?: () => void;
  } | undefined,
  apiManager: ApiManager,
) => {
  const getInternalMessage = useInternalMessageTransformer();
  const { transformMessage } = useAdapterContext();

  const onCreatePair = async (
    content: MessageUserContent,
    reason: BeforeUserMessageSendFnParams['reason'],
    parentMessage?: MessageModel
  ) => {
    let userMessage: MessageModel;
    let assistantMessage: MessageModel;
    const branchMessages = thread?.messages.currentMessages.value ?? [];

    if (beforeUserMessageSend) {
      // console.log('beforeUserMessageSend', branchMessages);
      const history = branchMessages.map(v => getInternalMessage(v));
      let text = '';
      if (typeof content === 'string') {
        text = content;
      } else if (Array.isArray(content)) {
        text = (content.filter(v => v.type === 'text') as TextContent[])?.[0]?.text ?? '';
      }

      const pairs = await beforeUserMessageSend({
        text,
        content,
        history,
        parentMessage: parentMessage ? getInternalMessage(parentMessage) : undefined,
        reason,
      });

      if (pairs.userMessage?.role !== ChatMessageOwner.USER) {
        throw new Error(`userMessage.role must be "user". ${pairs.userMessage?.role} given`);
      }

      if (pairs.assistantMessage?.role !== ChatMessageOwner.ASSISTANT) {
        throw new Error(`userMessage.role must be "assistant". ${pairs.assistantMessage?.role} given`);
      }

      userMessage = new MessageModel(
        transformMessage ? transformMessage(pairs.userMessage) : pairs.userMessage
      );
      assistantMessage = new MessageModel(
        transformMessage ? transformMessage(pairs.assistantMessage) : pairs.assistantMessage
      );
    } else {
      if (!parentMessage) {
        parentMessage = arrayLast(branchMessages);
      }

      userMessage = new MessageModel({
        id: uuidv4(),
        content,
        role: ChatMessageOwner.USER,
        time: moment().unix(),
        parentId: parentMessage?.id,
        tool: thread?.tool.value,
      });

      assistantMessage = new MessageModel({
        id: 'NEW_MESSAGE_' + randomId(),
        content: '',
        role: ChatMessageOwner.ASSISTANT,
        // должно быть больше для правильной сортировки
        time: moment().unix() + 1,
        parentId: userMessage.id,
      });
    }

    return { userMessage, assistantMessage }

  };

  const onEditMessage = async (content: MessageUserContent, messageEdit: MessageModel) => {
    if (!thread) return;

    const parentMessage = thread.messagesArray.find(v => v.id === messageEdit.parentId);

    const { userMessage, assistantMessage } = await onCreatePair(content, 'editMessage', parentMessage);

    // TODO: There is a bug here, when we change the branch, the user's message is automatically added to it,
    //  so a new user message is passed in the history
    apiManager.apiRef.current?.handleChangeBranch(userMessage);

    onSendMessage(content, userMessage, assistantMessage);

    thread.messages.push(userMessage, assistantMessage);

    return userMessage;
  };

  const onSendMessage = (
    content: MessageUserContent,
    userMessage: MessageModel,
    assistantMessage: MessageModel,
  ) => {
    if (!thread) {
      throw new Error('thread is undefined');
    }
    if (typeof content === 'string') {
      content = [{ type: 'text', text: content }];
    }

    thread.isTyping.value = true;
    assistantMessage.typing.value = true;
    const messageSender = new MessageSender(
      content,
      userMessage,
      assistantMessage,
      thread,
    );

    return new Promise<{ message: InternalMessageType }>((resolve, reject) => {
      const streamParams = messageSender.getUserParams(resolve, getInternalMessage);
      const res = thread.streamMessage(messageSender.getUserParams(resolve, getInternalMessage));

      if (res instanceof Promise) {
        res
          .then(streamParams.onFinish)
          .catch((reason) => {
            messageSender.changeTypingStatus(false);
            thread.isTyping.value = false;
            reject(reason);
          });
      }
    });
  };

  const onSendNewsMessage = (content: MessageUserContent) => {
    return new Promise<boolean>(async (resolve) => {

      if (content.length && thread) {
        try {
          if (thread.isEmpty.value) {
            if (onFirstMessageSent) {
              await onFirstMessageSent?.({ thread: thread.data });
            }

            if (!model.get(thread.id)) {
              model.list.value = [...model.list.value, thread];
            }

            thread.isEmpty.value = false;
          }

          const pair = await onCreatePair(content, 'newMessage');

          onSendMessage(content, pair.userMessage, pair.assistantMessage)
            .then(({ message }) => {
              resolve(true);
              onAssistantMessageTypingFinish?.({ message, thread: thread.data });
            })
            .catch(() => resolve(false));

          thread.messages.push(pair.userMessage, pair.assistantMessage);

          scroller?.handleBottomScroll?.();
        } catch (e) {
          console.error(e);
          resolve(false);
        }
      }
    });

  };

  return {
    onSendNewsMessage,
    onEditMessage,
  };
}
