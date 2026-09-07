import * as React from 'react';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useObserverValue } from '../hooks/useObserverValue';
import { MessageNavController } from './useMessageNavController';

type Props = {
  controller: MessageNavController;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * The rail is built around hovering a narrow column, which a touch screen cannot do,
   * so below the `md` breakpoint it is swapped for a list opened from a button.
   */
  isTablet: boolean;
};

/**
 * Subscribes to the active message on behalf of the navigation slots, so that scrolling
 * re-renders this small component instead of the whole thread.
 */
const MessageNavContainer: React.FC<Props> = ({ controller, contentRef, isTablet }) => {
  const { slots, slotProps } = useChatSlots();
  const activeIndex = useObserverValue(controller.activeIndex, 0);

  if (isTablet) {
    return (
      <slots.messageNavList
        {...slotProps.messageNavList}
        userMessages={controller.userMessages}
        activeIndex={activeIndex ?? 0}
        onJump={controller.onJump}
      />
    );
  }

  return (
    <slots.messageNavRail
      {...slotProps.messageNavRail}
      userMessages={controller.userMessages}
      activeIndex={activeIndex ?? 0}
      contentRef={contentRef}
      onJump={controller.onJump}
    />
  );
}

export default MessageNavContainer;
