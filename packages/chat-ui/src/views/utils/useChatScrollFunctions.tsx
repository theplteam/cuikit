import * as React from 'react';
import throttle from 'lodash.throttle';
import { ChatScrollerType } from './ChatScrollerType';
import { NOOP } from '../../utils/NOOP';
import { ThreadModel } from '../../models/ThreadModel';
import { useTablet } from '../../ui/Responsive';
import { isWindowCheck } from '../hooks/useScrollSave';

export const useChatScrollFunctions = (
  thread: ThreadModel | undefined,
  scrollTo: (top: number, behavior?: 'smooth') => void,
  getPosition: ChatScrollerType,
  getScrollContainer: () => HTMLDivElement | undefined | Window,
) => {
  const [showButton, setShowButton] = React.useState(false);
  const [lastScrolledThread, setLastScrolledThread] = React.useState<ThreadModel | undefined>();
  const isTablet = useTablet();

  const handleBottomScroll = React.useCallback(() => {
    scrollTo(getPosition().scrollHeight, 'smooth');
  }, []);

  const handleCheckButtonState = React.useCallback(throttle(
    () => {
      const container = getPosition();
      const btnState = (container.scrollHeight > Math.ceil(container.scrollTop + container.offsetHeight) + 50);

      if (showButton !== btnState) {
        setShowButton(btnState);
      }
    }, 300, { trailing: true }
  ), [showButton]);

  const handleSaveScrollPosition = React.useCallback(throttle(
    () => {
      if (thread) {
        thread.scrollY = getPosition().scrollTop;
      }
    }, 100
  ), [thread?.id]);

  const onScrollCallback = React.useCallback(() => {
    handleCheckButtonState();
    handleSaveScrollPosition();
    },
    [handleCheckButtonState, handleSaveScrollPosition]
  );

  // scroll the dialog to the end of the list or to the previous location when opening
  React.useEffect(() => {
    if (thread && lastScrolledThread?.id !== thread.id) {
      setLastScrolledThread(thread);
      if (thread.scrollY < 0) {
        // feature removed because the auto-scroll when opening a thread was annoying
        // TODO: in the first frame the height is incomplete, then updates
        /*setTimeout(() => {
          const scrollHeight = getPosition().scrollHeight * 1.5;
          scrollTo(scrollHeight, 'smooth');
        }, 100);*/

      } else {
        scrollTo(thread.scrollY);
      }
    }
  }, [thread?.id]);

  React.useEffect(() => {
    if (!thread) return NOOP;
    const scrollContainer = getScrollContainer();
    scrollContainer?.addEventListener('scroll', onScrollCallback);

    return () => {
      scrollContainer?.removeEventListener('scroll', onScrollCallback);
    }
  }, [onScrollCallback, thread?.id]);

  // Track dialog size changes to hide/show the "Down" button
  React.useEffect(() => {
    let container = getScrollContainer() as HTMLElement | Window | null;
    if (!container || isWindowCheck(container)) container = document.body;

    const observer = new ResizeObserver(handleCheckButtonState);
    observer.observe(container)
    return () => observer.disconnect();
  }, [getScrollContainer]);

  /**
   * Following the message has always been jerky and is now irrelevant,
   * since modern LLMs quickly provide an answer, the user won't have time to read it
   */

  return {
    scrollButtonEnabled: showButton,
    handleCheckButtonState,
    handleBottomScroll,
    handleSaveScrollPosition,
    isTablet,
  };
}
