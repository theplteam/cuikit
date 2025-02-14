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
import { usePropsSlots } from './core/usePropsSlots';
import { useInitializeApiRef } from './core/useInitializeApiRef';
import { DDialogue, DMessage } from '../models';
import { LocalizationProvider } from './core/LocalizationContext';

const Chat = <DM extends DMessage, DD extends DDialogue<DM>>(usersProps: React.PropsWithChildren<ChatUsersProps<DM, DD>>) => {
  const apiRef = useInitializeApiRef(usersProps.apiRef);
  const props = useChatProps(usersProps);
  const { slots, slotProps, coreSlots } = usePropsSlots(usersProps);

  return (
    <>
      <ChatGlobalProvider
        props={props}
        apiRef={apiRef}
      >
        <LocalizationProvider>
          <ChatSlotsProvider slots={slots} coreSlots={coreSlots} slotProps={slotProps}>
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
            <ChatDialogueComponent
              apiRef={apiRef}
              contentRef={usersProps.scrollerRef}
            />
            {usersProps.children}
          </ChatSlotsProvider>
        </LocalizationProvider>
      </ChatGlobalProvider>
      <ChatSnackbar />
    </>
  );
}

export default Chat;
