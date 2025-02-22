import * as React from 'react';
import { ThreadModel, DMessage, StreamResponseState, TextContent } from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { ChatUsersProps } from '../core/useChatProps';

export const useThreadSendMessage = (
  thread: ThreadModel | undefined,
  onThreadCreated: ChatUsersProps<any, any>['onThreadCreated'],
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller?: {
    handleBottomScroll?: () => void;
  }
) => {
  return React.useCallback((content: DMessage['content']) => {
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
          const createdNew = await thread.createIfEmpty();
          if (createdNew) {
            onThreadCreated?.(thread.data.data);
          }
          thread.sendMessage(lastMessage, text, images)
            .then(() => {
              resolve(true);
              onAssistantMessageTypingFinish?.(thread.data.data);
              thread.streamStatus.value = StreamResponseState.FINISH_MESSAGE;
            })
            .catch(() => resolve(false));

          scroller?.handleBottomScroll?.();
        } catch (e) {
          resolve(false);
        }
      }
    });

  }, [
    thread,
    arrayPluck(thread?.messages.currentMessages.value ?? [], 'id').join(','),
    onThreadCreated,
    onAssistantMessageTypingFinish,
    scroller?.handleBottomScroll
  ]);
}
