import * as React from 'react';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { Thread } from '../../../models';
import Stack from '@mui/material/Stack';
import HistorySkeleton from '../HistorySkeleton';
import ThreadDeleteConfirm from '../ThreadDeleteConfirm';
import { useThreadsList } from './useThreadsList';
import ThreadListMapBlockGroupItem from './ThreadListMapBlockGroupItem';

const ThreadsListMapBlock: React.FC = () => {
  const { loading, threads, apiRef, onChangeCurrentThread, model } = useChatContext();
  const { slots, slotProps } = useChatSlots();
  const groupsMap = useThreadsList(threads, model) ?? {};

  const setThread = (thread: Thread) => {
    if (model.currentThread.value?.id !== thread.id) {
      onChangeCurrentThread?.({ thread });
      apiRef.current?.onChangeThread(thread.id);
    }
  };

  return (
    <>
      <Stack position="relative">
        {loading ? <HistorySkeleton /> : null}
        {!loading && groupsMap.map((groupModel, key) => (
          <ThreadListMapBlockGroupItem
            key={groupModel.data.id}
            listGroupItem={groupModel}
            slot={slots.listTimeText}
            slotProps={slotProps.listTimeText}
            model={model}
            setThread={setThread}
            index={key}
          />
        ))}
      </Stack>
      <ThreadDeleteConfirm />
    </>
  );
}

export default ThreadsListMapBlock;
