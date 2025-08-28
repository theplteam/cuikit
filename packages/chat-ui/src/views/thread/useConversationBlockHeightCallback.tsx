import { ChatViewConstants } from '../ChatViewConstants';

export const useConversationBlockHeightCallback = (contentRef?: React.RefObject<HTMLDivElement | null>, getConversationBlockHeightMin?: (calculatedHeight: number) => number) => {
  const textFieldHeight = document.getElementById(ChatViewConstants.TEXT_FIELD_ROW_ID)?.clientHeight || 0;
  const paddingsSum = ChatViewConstants.MESSAGE_ROW_PADDING_TOP + ChatViewConstants.MESSAGE_ROW_PADDING_BOTTOM;

  return () => {
    const boxHeight = contentRef?.current?.clientHeight || document.getElementById(ChatViewConstants.DIALOGUE_ROOT_ID)?.clientHeight || 0;
    const calculatedHeight = Math.max(0, boxHeight - textFieldHeight - paddingsSum);
    const usersHeight = getConversationBlockHeightMin?.(calculatedHeight);
    return usersHeight ?? calculatedHeight;
  };
}
