import * as React from 'react';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useObserverValue } from '../hooks/useObserverValue';
import { MessageNavController } from './useMessageNavController';

type Props = {
  controller: MessageNavController;
  contentRef?: React.RefObject<HTMLDivElement | null>;
};

/**
 * Subscribes to the active message on behalf of the rail slot, so that scrolling
 * re-renders this small component instead of the whole thread.
 */
const MessageNavContainer: React.FC<Props> = ({ controller, contentRef }) => {
  const { slots, slotProps } = useChatSlots();
  const activeIndex = useObserverValue(controller.activeIndex, 0);

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
