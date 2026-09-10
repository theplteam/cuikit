import * as React from 'react';
import NewChatButton from './NewChatButton';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type SimpleBarCore from 'simplebar-core';
import SimpleScrollbar, { simpleBarClasses } from '../../ui/SimpleScrollbar';
import ThreadsListMapBlock from './listMap/ThreadsListMapBlock';
import { useHistoryContext } from '../core/history/HistoryContext';

/**
 * `height: 100%` (not `maxHeight`) is what makes simplebar's scroll node take a
 * definite height — its wrapper uses `height: inherit`, so a percentage against
 * an auto-height parent resolves to nothing.
 *
 * This relies on `SimpleScrollbar` forwarding `className`; without that the
 * generated class reaches no DOM node and the sidebar loses its height bound.
 */
const HistoryScrollbar = styled(SimpleScrollbar)({
  height: '100%',
  [`& .${simpleBarClasses.contentWrapper}`]: {
    // Browser scroll anchoring fights the virtualizer's own positioning.
    overflowAnchor: 'none',
  },
});

const ChatHistory: React.FC = () => {
  const { slots, slotProps, apiRef, locale, enableVirtualization } = useHistoryContext();

  const [scrollbar, setScrollbar] = React.useState<SimpleBarCore | null>(null);
  const [viewportElement, setViewportElement] = React.useState<HTMLElement | null>(null);

  // simplebar-react assigns this in a passive effect, so the instance is absent
  // for the first paint. That is tolerated downstream — the virtualizer re-reads
  // its scroll element on every render.
  const handleScrollbar = React.useCallback((instance: SimpleBarCore | null) => {
    setScrollbar(instance);
  }, []);

  const scrollElement = scrollbar?.getScrollElement() ?? null;

  const openNewThread = () => {
    const thread = apiRef.current?.handleCreateNewThread?.();
    if (thread) {
      apiRef.current?.openNewThread(thread);
    }
  };

  const list = (
    <ThreadsListMapBlock
      scrollbar={scrollbar}
      scrollElement={scrollElement}
      viewportElement={viewportElement}
    />
  );

  return (
    <slots.historyWrapper
      gap={2}
      height="100%"
      minHeight={enableVirtualization ? 0 : undefined}
      width="100%"
      {...slotProps.historyWrapper}
    >
      <NewChatButton openNewThread={openNewThread} />
      <Box
        flexShrink={enableVirtualization ? 0 : undefined}
        mb={0.5}
        mx={2}
      >
        <slots.listSubtitle {...slotProps.listSubtitle}>
          {locale.historyTitle}
        </slots.listSubtitle>
      </Box>
      {/*
        The layout below is keyed off the flag rather than the measured mode:
        deciding it after measuring would be circular. With virtualization off
        the box keeps the historical implicit flex-shrink behaviour untouched.
      */}
      {enableVirtualization ? (
        <Box
          ref={setViewportElement}
          flex="1 1 0"
          minHeight={0}
          overflow="hidden"
        >
          <HistoryScrollbar ref={handleScrollbar}>
            {list}
          </HistoryScrollbar>
        </Box>
      ) : (
        <Box overflow="hidden">
          <SimpleScrollbar style={{ maxHeight: '100%' }}>
            {list}
          </SimpleScrollbar>
        </Box>
      )}
    </slots.historyWrapper>
  );
}

export default ChatHistory;
