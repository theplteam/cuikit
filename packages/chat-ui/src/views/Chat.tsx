import * as React from 'react';
import ChatDialogueComponent from './ChatDialogueComponent';
import { ChatUsersProps, useChatProps } from './core/useChatProps';
import { ChatGlobalProvider } from './core/ChatGlobalContext';
import ChatAppDriver from './leftContainer/ChatAppDriver';
import Box from '@mui/material/Box';
import ChatDialoguesListBlock from './leftContainer/ChatDialoguesListBlock';
import DialoguesList from './leftContainer/DialoguesList';
import { HiddenDesktop } from '../ui/Responsive';
import ChatSnackbar from './ChatSnackbar';
import { Dialogue } from '../models/Dialogue';
import { ChatSlotsProvider } from './core/ChatSlotsContext';
import { useChatPropsSlots } from './core/useChatPropsSlots';
import { DDialogue } from '../models/DialogueData';

const Chat = <DialogueData extends DDialogue, D extends Dialogue<DialogueData>>(usersProps: React.PropsWithChildren<ChatUsersProps<D>>) => {
  const props = useChatProps(usersProps);
  const slots = useChatPropsSlots(usersProps.slots);

  return (
    <>
        {/** TODO: ANY */}
        <ChatGlobalProvider props={props as any}>
          <ChatSlotsProvider props={slots}>
            <slots.listDriver>
              <HiddenDesktop>
                <ChatAppDriver>
                  <Box display={'flex'} flexDirection={'column'} height={500}>
                    <ChatDialoguesListBlock />
                  </Box>
                </ChatAppDriver>
              </HiddenDesktop>
            </slots.listDriver>
            <slots.list>
              <DialoguesList />
            </slots.list>
            <slots.dialogue>
              <ChatDialogueComponent
                contentRef={usersProps.scrollerRef}
              />
            </slots.dialogue>
            {usersProps.children}
          </ChatSlotsProvider>
        </ChatGlobalProvider>
      <ChatSnackbar />
    </>
  );
}

export default Chat;
