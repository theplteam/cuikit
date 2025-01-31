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
import { ChatSlotsProvider } from './core/ChatSlotsContext';
import { useChatPropsSlots } from './core/useChatPropsSlots';
import { Dialogue } from '../models/dialogue/Dialogue';

const Chat = <D extends Dialogue>(usersProps: React.PropsWithChildren<ChatUsersProps<D>>) => {
  const props = useChatProps(usersProps);
  const slots = useChatPropsSlots<D>(usersProps.slots);

  return (
    <>
        <ChatGlobalProvider props={props}>
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
