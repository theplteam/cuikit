import { ChatViewConstants } from '../ChatViewConstants';

export const useConversationBlockHeightCallback = (getConversationBlockHeightMin?: (calculatedHeight: number) => number) => {
  return () => {

    const box = document.getElementById(ChatViewConstants.DIALOGUE_ROOT_ID);

    // TODO: Need to somehow remove these hardcoded numbers
    const textFieldHeightBase = 64;
    const paddingsSum = 40;

    const caculatedHeight = Math.max(0, (box?.clientHeight ?? 0) - textFieldHeightBase - paddingsSum);

    const usersHeight = getConversationBlockHeightMin?.(caculatedHeight);
    return usersHeight ?? caculatedHeight;
  };
}
