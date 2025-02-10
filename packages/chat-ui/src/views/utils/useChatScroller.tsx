import * as React from 'react';
import { useChatScrollFunctions } from './useChatScrollFunctions';
import { DialogueLight } from '../../models/Dialogue';

export const useChatScroller = (
  dialogue: DialogueLight | undefined,
  contentRef: React.RefObject<HTMLDivElement | null> | undefined
) => {
  const { handleBottomScroll, scrollButtonEnabled, isTablet } = useChatScrollFunctions(
    dialogue,
    (top, behavior) => {
      requestAnimationFrame(() => {
        if (contentRef) {
          contentRef.current?.scrollTo({
            top,
            behavior: behavior === 'smooth' ? 'smooth' : 'auto',
          })
        } else {
          window.scrollTo({
            top,
            behavior: behavior === 'smooth' ? 'smooth' : 'auto',
          })
        }
      });
    },
    () => {
      if (contentRef) {
        return {
          scrollHeight: contentRef.current?.scrollHeight ?? 0,
          scrollTop: contentRef.current?.scrollTop ?? 0,
          offsetHeight: contentRef.current?.offsetHeight ?? 0,
        }
      } else {
        return {
          scrollHeight: document.documentElement.scrollHeight,
          scrollTop: window.scrollY,
          offsetHeight: window.innerHeight,
        }
      }
    },
    () => contentRef ? contentRef.current ?? undefined : window,
  );

  return {
    handleBottomScroll, scrollButtonEnabled, isTablet
  };
}
