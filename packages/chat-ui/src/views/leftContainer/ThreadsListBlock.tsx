import * as React from 'react';
import ThreadDeleteConfirm from './ThreadDeleteConfirm';
import Stack from '@mui/material/Stack';
import HistorySkeleton from './HistorySkeleton';
import TimeGroupItem from './TimeGroupItem';
import Box from '@mui/material/Box';
import ThreadListItem from './ThreadListItem';
import { useThreadsGroupedList } from './useThreadsGroupedList';
import { useChatContext } from '../core/ChatGlobalContext';
import DelayRenderer from '../../ui/DelayRenderer';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Thread } from '../../models';

const ThreadsListBlock: React.FC = () => {
  const { loading, threads, thread: currentThread, apiRef, onChangeCurrentThread } = useChatContext();
  const { slots, slotProps } = useChatSlots();
  const { groupsValues, threadsInGroup } = useThreadsGroupedList(threads);

  const setThread = React.useCallback((thread: Thread) => {
    if (currentThread?.id !== thread.id) {
      onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  }, [onChangeCurrentThread, currentThread, apiRef.current]);

  return (
    <>
      <Stack position="relative">
        {loading ? <HistorySkeleton /> : null}
        {!loading && (
          <DelayRenderer once timeout={200} fallback={<HistorySkeleton />}>
            <>
              {groupsValues.map((group) => (
                <React.Fragment key={group.id}>
                  <TimeGroupItem
                    key={group.id}
                    group={group}
                    textComponent={slots.listTimeText}
                    textComponentProps={slotProps.listTimeText}
                  />
                  {threadsInGroup.map(({ groupKey, thread }) => {
                    if (groupKey !== group.id) return null;
                    return (
                      <Box key={thread.id}>
                        <ThreadListItem
                          currentThread={currentThread}
                          setThread={setThread}
                          thread={thread}
                        />
                      </Box>
                    );
                  })}
                </React.Fragment>
              ))}
            </>
          </DelayRenderer>
        )}
      </Stack>
      <ThreadDeleteConfirm />
    </>
  );
};

export default ThreadsListBlock;
