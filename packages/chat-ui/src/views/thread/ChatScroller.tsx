import * as React from 'react';
import { useChatScroller } from '../utils/useChatScroller';
import ScrollBottomButton from './ScrollBottomButton';
import { ThreadModel } from '../../models/ThreadModel';
import { BoxRefType } from '../hooks/useElementRef';
import { ApiManager } from '../core/useApiManager';

export type ChatScrollApiRef = {
  handleBottomScroll: () => void;
};

type Props = {
  scrollApiRef: React.RefObject<ChatScrollApiRef>;
  thread: ThreadModel | undefined;
  contentRef?: BoxRefType;
  apiManager: ApiManager;
};

const ChatScroller: React.FC<Props> = ({ thread, contentRef, scrollApiRef, apiManager }) => {
  const { scrollButtonEnabled, handleBottomScroll, handleCheckButtonState } = useChatScroller(thread, contentRef);

  React.useMemo(() => {
    if (scrollApiRef.current) {
      scrollApiRef.current.handleBottomScroll = handleBottomScroll;
    }
  }, [handleBottomScroll, scrollApiRef.current]);

  React.useEffect(() => {
    apiManager.setPrivateMethod('updateScrollButtonState', handleCheckButtonState);
  }, [handleCheckButtonState]);

  return (
    <ScrollBottomButton enabled={scrollButtonEnabled} onClick={handleBottomScroll} />
  );
}

export default ChatScroller;
