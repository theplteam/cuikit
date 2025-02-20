import * as React from 'react';
import { Dialogue, DMessage, StreamResponseState, TextContent } from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { ChatUsersProps } from '../core/useChatProps';

export const useDialogueSendMessage = (
  dialogue: Dialogue | undefined,
  onDialogueCreated: ChatUsersProps<any, any>['onDialogueCreated'],
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller?: {
    handleBottomScroll?: () => void;
  }
) => {
  return React.useCallback(async (content: DMessage['content']) => {
    const branchMessages = dialogue?.messages.currentMessages.value ?? [];
    let text = '';
    let images: string[] = [];

    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = (content.filter(v => v.type === 'text') as TextContent[])?.[0]?.text ?? '';
      images = content.map(v => v.type === 'image_url' ? v.image_url.url : undefined).filter(v => !!v) as string[];
    }

    if ((images?.length || text) && dialogue) {
      const lastMessage = arrayLast(branchMessages);

      dialogue.streamStatus.value = StreamResponseState.START;
      const createdNew = await dialogue.createIfEmpty();
      if (createdNew) {
        onDialogueCreated?.(dialogue.data.data);
      }
      dialogue.sendMessage(lastMessage, text, images)
        .then(() => {
          onAssistantMessageTypingFinish?.(dialogue.data.data);
          dialogue.streamStatus.value = StreamResponseState.FINISH_MESSAGE;
        });

      scroller?.handleBottomScroll?.();
    }
  }, [
    dialogue,
    arrayPluck(dialogue?.messages.currentMessages.value ?? [], 'id').join(','),
    onDialogueCreated,
    onAssistantMessageTypingFinish,
    scroller?.handleBottomScroll
  ]);
}
