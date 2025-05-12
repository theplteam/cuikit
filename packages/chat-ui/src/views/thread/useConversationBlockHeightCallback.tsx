import { ChatViewConstants } from '../ChatViewConstants';

export const useConversationBlockHeightCallback = (getConversationBlockHeightMin?: (calculatedHeight: number) => number) => {
  return () => {

    const box = document.getElementById(ChatViewConstants.DIALOGUE_ROOT_ID);

    const textField = document.getElementById(ChatViewConstants.TEXT_FIELD_ROW_ID);

    console.log(box?.clientHeight, box?.style.padding, textField?.clientHeight, textField?.offsetHeight);

    const paddingsSum = 40;

    const caculatedHeight = Math.max(0, (box?.clientHeight ?? 0) - (textField?.offsetHeight ?? 0) - paddingsSum);

    return getConversationBlockHeightMin?.(caculatedHeight) ?? caculatedHeight;
  };
}
