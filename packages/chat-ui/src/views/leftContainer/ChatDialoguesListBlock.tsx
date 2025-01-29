import * as React from 'react';
import DialogDeleteConfirm from './DialogDeleteConfirm';
import DialogueSharing from './share/DialogueSharing';
import DialogueInfoPopup from './info/DialogueInfoPopup';
import Stack from '@mui/material/Stack';
import ChatHistorySkeleton from './ChatHistorySkeleton';
import TimeGroupItem from './TimeGroupItem';
import Box from '@mui/material/Box';
import DialogueListItem from './DialogueListItem';
import { useDialogueGroupedList } from './useDialogueGroupedList';
import { useChatContext } from '../core/ChatGlobalContext';
import DelayRenderer from '../../ui/DelayRenderer';

type Props = {};

const ChatDialoguesListBlock: React.FC<Props> = () => {
  const { loading, model: chat, dialogues, dialogue: currentDialogue, setDialogue } = useChatContext();
  const { groupsValues, dialoguesInGroup } = useDialogueGroupedList(dialogues);
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
                />
                {dialoguesInGroup.map(({ groupKey, dialogue }) => {
                  if (groupKey !== group.id) return null;
                  return (
                    <Box key={dialogue.id}>
                      <DialogueListItem
                        currentDialogue={currentDialogue}
                        setDialogue={setDialogue}
                        dialogue={dialogue}
                        chat={chat}
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
      <DialogDeleteConfirm chat={chat} />
      <DialogueSharing chat={chat} />
      <DialogueInfoPopup chat={chat} />
    </>
  );
};

export default ChatDialoguesListBlock;
