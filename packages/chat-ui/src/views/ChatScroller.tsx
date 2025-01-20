import * as React from 'react';
import { useChatScroller } from './utils/useChatScroller';
import ScrollBottomButton from './ScrollBottomButton';
import { ChatDialogue } from '../models/ChatDialogue';
import { BoxRefType } from './hooks/useElementRef';

export type ChatScrollApiRef = {
  handleBottomScroll: () => void;
};

type Props = {
  scrollApiRef: React.RefObject<ChatScrollApiRef>;
  dialogue: ChatDialogue | undefined;
  contentRef?: BoxRefType;
};

const ChatScroller: React.FC<Props> = ({ dialogue, contentRef, scrollApiRef }) => {
  const { scrollButtonEnabled, handleBottomScroll } = useChatScroller(dialogue, contentRef);

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
