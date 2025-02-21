import * as React from 'react';
import DialogDeleteConfirm from './DialogDeleteConfirm';
import Stack from '@mui/material/Stack';
import ChatHistorySkeleton from './ChatHistorySkeleton';
import TimeGroupItem from './TimeGroupItem';
import Box from '@mui/material/Box';
import DialogueListItem from './DialogueListItem';
import { useThreadsGroupedList } from './useThreadsGroupedList';
import { useChatContext } from '../core/ChatGlobalContext';
import DelayRenderer from '../../ui/DelayRenderer';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Thread } from '../../models';

type Props = {};

const ChatDialoguesListBlock: React.FC<Props> = () => {
  const { loading, model, threads, thread: currentDialogue, apiRef, onChangeCurrentThread } = useChatContext();
  const { slots, slotProps } = useChatSlots();
  const { groupsValues, threadsInGroup } = useThreadsGroupedList(threads);

  const setDialogue = React.useCallback((thread: Thread) => {
    if (currentDialogue?.id !== thread.id) {
      onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  }, [onChangeCurrentThread, currentDialogue, apiRef.current]);

  return (
    <>
      <Stack position={'relative'}>
        {loading && <ChatHistorySkeleton />}
        {!loading && (
          <DelayRenderer timeout={200} fallback={<ChatHistorySkeleton />} once>
            <>
            {groupsValues.map((group) => (
              <React.Fragment key={group.id}>
                <TimeGroupItem
                  group={group}
                  key={group.id}
                  textComponent={slots.listTimeText}
                  textComponentProps={slotProps.listTimeText}
                />
                {threadsInGroup.map(({ groupKey, thread }) => {
                  if (groupKey !== group.id) return null;
                  return (
                    <Box key={thread.id}>
                      <DialogueListItem
                        currentThread={currentDialogue}
                        setThread={setDialogue}
                        thread={thread}
                        model={model}
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
      <DialogDeleteConfirm />
    </>
  );
};

export default ChatDialoguesListBlock;
