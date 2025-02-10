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
import { DialogueAbstract } from '../models/DialogueAbstract';
import { useInitializeApiRef } from './core/useInitializeApiRef';
import Watermark from './Watermark';

const Chat = <D extends DialogueAbstract>(usersProps: React.PropsWithChildren<ChatUsersProps<D>>) => {
  const apiRef = useInitializeApiRef(usersProps.apiRef);
  const props = useChatProps(usersProps);
  const { slots, slotProps, coreSlots } = usePropsSlots<D>(usersProps.slots, usersProps.coreSlots, usersProps.slotProps);

  return (
    <>
      <ChatGlobalProvider props={props}>
        <ChatSlotsProvider slots={slots} coreSlots={coreSlots} slotProps={slotProps}>
          <Watermark />
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
              apiRef={apiRef}
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
