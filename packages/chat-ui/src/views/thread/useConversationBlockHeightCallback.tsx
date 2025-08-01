import { ChatViewConstants } from '../ChatViewConstants';

export const useConversationBlockHeightCallback = (getConversationBlockHeightMin?: (calculatedHeight: number) => number) => {
  const boxHeight = document.getElementById(ChatViewConstants.DIALOGUE_ROOT_ID)?.clientHeight || 0;
  const textFieldHeight = document.getElementById(ChatViewConstants.TEXT_FIELD_ROW_ID)?.clientHeight || 0;
  const paddingsSum = ChatViewConstants.MESSAGE_ROW_PADDING_TOP + ChatViewConstants.MESSAGE_ROW_PADDING_BOTTOM;
  const calculatedHeight = Math.max(0, boxHeight - textFieldHeight - paddingsSum);

  return () => {
    const usersHeight = getConversationBlockHeightMin?.(calculatedHeight);
    return usersHeight ?? calculatedHeight;
  };
}
