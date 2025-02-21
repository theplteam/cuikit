import * as React from 'react';
import { ThreadModel, DMessage, StreamResponseState, TextContent } from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { ChatUsersProps } from '../core/useChatProps';

export const useDialogueSendMessage = (
  dialogue: ThreadModel | undefined,
  onDialogueCreated: ChatUsersProps<any, any>['onDialogueCreated'],
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller?: {
    handleBottomScroll?: () => void;
  }
) => {
  return React.useCallback((content: DMessage['content']) => {
    const branchMessages = dialogue?.messages.currentMessages.value ?? [];
    let text = '';
    let images: string[] = [];

    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = (content.filter(v => v.type === 'text') as TextContent[])?.[0]?.text ?? '';
      images = content.map(v => v.type === 'image_url' ? v.image_url.url : undefined).filter(v => !!v) as string[];
    }

    return new Promise<boolean>(async (resolve) => {
      if ((images?.length || text) && dialogue) {
        const lastMessage = arrayLast(branchMessages);

        dialogue.streamStatus.value = StreamResponseState.START;

        try {
          const createdNew = await dialogue.createIfEmpty();
          if (createdNew) {
            onDialogueCreated?.(dialogue.data.data);
          }
          dialogue.sendMessage(lastMessage, text, images)
            .then(() => {
              resolve(true);
              onAssistantMessageTypingFinish?.(dialogue.data.data);
              dialogue.streamStatus.value = StreamResponseState.FINISH_MESSAGE;
            })
            .catch(() => resolve(false));

          scroller?.handleBottomScroll?.();
        } catch (e) {
          resolve(false);
        }
      }
    });

  }, [
    dialogue,
    arrayPluck(dialogue?.messages.currentMessages.value ?? [], 'id').join(','),
    onDialogueCreated,
    onAssistantMessageTypingFinish,
    scroller?.handleBottomScroll
  ]);
}
