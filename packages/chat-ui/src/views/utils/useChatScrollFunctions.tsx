import * as React from 'react';
import throttle from 'lodash.throttle';
import { useMessageFollowing } from './useMessageFollowing';
import { ChatScrollerType } from './ChatScrollerType';
import { NOOP } from '../../utils/NOOP';
import { ThreadModel } from '../../models/ThreadModel';
import { useTablet } from '../../ui/Responsive';
import { isWindowCheck } from '../hooks/useScrollSave';

export const useChatScrollFunctions = (
  dialogue: ThreadModel | undefined,
  scrollTo: (top: number, behavior?: 'smooth') => void,
  getPosition: ChatScrollerType,
  getScrollContainer: () => HTMLDivElement | undefined | Window,
) => {
  const [showButton, setShowButton] = React.useState(false);
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
      if (dialogue) {
        dialogue.scrollY = getPosition().scrollTop;
      }
    }, 100
  ), [dialogue?.id]);


  const onScrollCallback = React.useCallback(() => {
    handleCheckButtonState();
    handleSaveScrollPosition();
    },
    [handleCheckButtonState, handleSaveScrollPosition]
  );

  // прокрутить диалог к концу списка или к предыдущему месту при открытии
  React.useEffect(() => {
    if (dialogue) {
      if (dialogue.scrollY < 0) {
        // TODO: в первом кадре высота неполная, потом обновляется
        setTimeout(() => {
          const scrollHeight = getPosition().scrollHeight * 1.5;
          scrollTo(scrollHeight, 'smooth');
        }, 100);

      } else {
        scrollTo(dialogue.scrollY);
      }
    }
  }, [dialogue?.id]);

  React.useEffect(() => {
    if (!dialogue) return NOOP;
    const scrollContainer = getScrollContainer();
    scrollContainer?.addEventListener('scroll', onScrollCallback);

    return () => {
      scrollContainer?.removeEventListener('scroll', onScrollCallback);
    }
  }, [onScrollCallback, dialogue?.id]);

  // Отслеживать изменения размеров диалога, чтобы скрывать/показывать кнопку "Вниз"
  React.useEffect(() => {
    let container = getScrollContainer() as HTMLElement | Window | null;
    if (!container || isWindowCheck(container)) container = document.body;

    const observer = new ResizeObserver(handleCheckButtonState);
    observer.observe(container)
    return () => observer.disconnect();
  }, [getScrollContainer]);

  useMessageFollowing(
    showButton,
    getPosition,
    scrollTo,
  );

  return {
    scrollButtonEnabled: showButton,
    handleCheckButtonState,
    handleBottomScroll,
    handleSaveScrollPosition,
    isTablet,
  };
}
