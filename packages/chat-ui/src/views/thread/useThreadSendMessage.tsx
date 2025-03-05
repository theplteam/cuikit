import * as React from 'react';
import { ThreadModel, Message, StreamResponseState, TextContent } from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { ChatUsersProps } from '../core/useChatProps';
import { Threads } from '../../models/Threads';

export const useThreadSendMessage = (
  thread: ThreadModel | undefined,
  model: Threads<any, any>,
  onFirstMessageSent: ChatUsersProps<any, any>['onFirstMessageSent'],
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller?: {
    handleBottomScroll?: () => void;
  }
) => {
  return React.useCallback((content: Message['content']) => {
    const branchMessages = thread?.messages.currentMessages.value ?? [];
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
        const lastMessage = arrayLast(branchMessages);

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
          thread.sendMessage(lastMessage, text, images)
            .then(({ message }) => {
              resolve(true);
              onAssistantMessageTypingFinish?.({ message, thread: thread.data.data });
              thread.streamStatus.value = StreamResponseState.FINISH_MESSAGE;
            })
            .catch(() => resolve(false));

          scroller?.handleBottomScroll?.();
        } catch (e) {
          console.error(e);
          resolve(false);
        }
      }
    });

  }, [
    thread,
    arrayPluck(thread?.messages.currentMessages.value ?? [], 'id').join(','),
    onFirstMessageSent,
    onAssistantMessageTypingFinish,
    scroller?.handleBottomScroll
  ]);
}
