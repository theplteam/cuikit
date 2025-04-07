import * as React from 'react';
import {
  ThreadModel,
  StreamResponseState,
  TextContent,
  MessageUserContent,
  MessageModel,
  ChatMessageOwner
} from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { ChatUsersProps } from '../core/useChatProps';
import { Threads } from '../../models/Threads';
import { useAdapterContext, useInternalMessageTransformer } from '../adapter/AdapterContext';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';
import { randomId } from '../../utils/numberUtils/randomInt';
import { MessageSender } from '../../models/MessageSender';

export const useThreadSendMessage = (
  thread: ThreadModel | undefined,
  model: Threads<any, any>,
  onFirstMessageSent: ChatUsersProps<any, any>['onFirstMessageSent'],
  beforeUserMessageSend: ChatUsersProps<any, any>['beforeUserMessageSend'],
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller?: {
    handleBottomScroll?: () => void;
  }
) => {
  const getInternalMessage = useInternalMessageTransformer();
  const { transformMessage } = useAdapterContext();

  const onCreatePair = React.useCallback(async (text: string | undefined, content: MessageUserContent, parentMessage?: MessageModel) => {
    let userMessage: MessageModel;
    let assistantMessage: MessageModel;
    const branchMessages = thread?.messages.currentMessages.value ?? [];

    if (beforeUserMessageSend) {
      const history = branchMessages.map(v => getInternalMessage(v.data));

      const pairs = await beforeUserMessageSend(text, content, history);

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
      });

      assistantMessage = new MessageModel({
        id: 'NEW_MESSAGE_' + randomId(),
        content: '',
        role: ChatMessageOwner.ASSISTANT,
        // должно быть больше для правильной сортировки
        time: moment().unix() + 1,
        parentId: userMessage.id,
      });

      return {
        userMessage, assistantMessage,
      };
    }

    return { userMessage, assistantMessage }

  }, [beforeUserMessageSend, getInternalMessage]);

  const onEditMessage = React.useCallback(async (newText: string, messageEdit: MessageModel) => {
    if (!thread) return;

    const parentMessage = thread.messagesArray.find(v => v.id === messageEdit.parentId);

    const content: MessageUserContent = [{ type: 'text', text: newText }];

    const { userMessage, assistantMessage } = await onCreatePair(newText, content, parentMessage);

    thread.messages.push(userMessage, assistantMessage);

    onSendMessage(content, userMessage, assistantMessage);

    return userMessage;
  }, []);

  const onSendMessage = React.useCallback((
    content: MessageUserContent,
    userMessage: MessageModel,
    assistantMessage: MessageModel,
  ) => {
    if (!thread) return undefined;
    if (typeof content === 'string') {
      content = [{ type: 'text', text: content }];
    }

    const internalUserMessage = getInternalMessage(userMessage);

    thread.isTyping.value = true;
    const messageSender = new MessageSender(
      content,
      userMessage,
      assistantMessage,
      thread,
    );

    return new Promise<void>((resolve, reject) => {
      const res = thread.streamMessage(messageSender.getUserParams(resolve, getInternalMessage));

      if (res instanceof Promise) {
        res
          .then(() => {
            messageSender.changeTypingStatus(false);
            thread.isTyping.value = false;
            assistantMessage.reasoningManager.updateTimeSec();
            onAssistantMessageTypingFinish?.({ message: internalUserMessage, thread: thread.data.data });
            thread.streamStatus.value = StreamResponseState.FINISH_MESSAGE;
            resolve();
          })
          .catch((reason) => {
            messageSender.changeTypingStatus(false);
            reject(reason);
          });
      }
    });

  }, [onAssistantMessageTypingFinish]);

  const onSendNewsMessage = React.useCallback((content: MessageUserContent) => {
    let text = '';
    let images: string[] = [];

    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = (content.filter(v => v.type === 'text') as TextContent[])?.[0]?.text ?? '';
      images = content.map(v => v.type === 'image_url' ? v.image_url.url : undefined).filter(v => !!v) as string[];
    }

    return new Promise<boolean>(async (resolve) => {

      if ((images?.length || text) && thread) {
        thread.streamStatus.value = StreamResponseState.START;

        try {
          if (thread.isEmpty.value) {
            if (onFirstMessageSent) {
              await onFirstMessageSent?.({ thread: thread.data.data });
            }

            if (!model.get(thread.id)) {
              model.list.value = [...model.list.value, thread];
            }

            thread.isEmpty.value = false;
          }

          const pair = await onCreatePair(text, content);

          thread.messages.push(pair.userMessage, pair.assistantMessage);

          onSendMessage(content, pair.userMessage, pair.assistantMessage)
            ?.then(() => resolve(true))
            ?.catch(() => resolve(false));

          scroller?.handleBottomScroll?.();
        } catch (e) {
          console.error(e);
          resolve(false);
        }
      }
    });

  }, [
    onCreatePair,
    thread,
    arrayPluck(thread?.messages.currentMessages.value ?? [], 'id').join(','),
    onFirstMessageSent,
    onAssistantMessageTypingFinish,
    scroller?.handleBottomScroll
  ]);

  return {
    onSendNewsMessage,
    onEditMessage,
  };
}
