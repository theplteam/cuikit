import * as React from 'react';
import { useChatScroller } from '../utils/useChatScroller';
import ScrollBottomButton from './ScrollBottomButton';
import { ThreadModel } from '../../models/ThreadModel';
import { BoxRefType } from '../hooks/useElementRef';

export type ChatScrollApiRef = {
  handleBottomScroll: () => void;
};

type Props = {
  scrollApiRef: React.RefObject<ChatScrollApiRef>;
  thread: ThreadModel | undefined;
  contentRef?: BoxRefType;
};

const ChatScroller: React.FC<Props> = ({ thread, contentRef, scrollApiRef }) => {
  const { scrollButtonEnabled, handleBottomScroll } = useChatScroller(thread, contentRef);

  React.useMemo(() => {
    if (scrollApiRef.current) {
      scrollApiRef.current.handleBottomScroll = handleBottomScroll;
    }
  }, [handleBottomScroll, scrollApiRef.current]);

  return (
    <ScrollBottomButton enabled={scrollButtonEnabled} onClick={handleBottomScroll} />
  );
}

export default ChatScroller;
