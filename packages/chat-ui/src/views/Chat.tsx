import * as React from 'react';
import ThreadComponent from './thread/ThreadComponent';
import { ChatUsersProps, useChatProps } from './core/useChatProps';
import { ChatGlobalProvider } from './core/ChatGlobalContext';
import AppDrawer from './leftContainer/AppDrawer';
import Box from '@mui/material/Box';
import ThreadsListBlock from './leftContainer/ThreadsListBlock';
import ThreadsList from './leftContainer/ThreadsList';
import { HiddenDesktop } from '../ui/Responsive';
import ChatSnackbar from './ChatSnackbar';
import { ChatSlotsProvider } from './core/ChatSlotsContext';
import { usePropsSlots } from './core/usePropsSlots';
import { useApiRef } from './core/useApiRef';
import { Thread, Message } from '../models';
import { LocalizationProvider } from './core/LocalizationContext';
import { useApiManager } from './core/useApiManager';

const Chat = <DM extends Message, DD extends Thread<DM>>(usersProps: React.PropsWithChildren<ChatUsersProps<DM, DD>>) => {
  const userApiRef = usersProps.apiRef;
  const apiRef = useApiRef<DM, DD>(userApiRef);
  const apiManager = useApiManager(apiRef, userApiRef);

  const props = useChatProps(usersProps);
  const { slots, slotProps, coreSlots } = usePropsSlots(usersProps);

  return (
    <>
      <ChatGlobalProvider
        // TODO: fix types
        // @ts-ignore
        props={props}
        apiManager={apiManager}
      >
        <LocalizationProvider>
          <ChatSlotsProvider slots={slots} coreSlots={coreSlots} slotProps={slotProps}>
            <slots.listDrawer>
              <HiddenDesktop>
                <AppDrawer>
                  <Box display="flex" flexDirection="column" height={500}>
                    {/* eslint-disable-next-line react/jsx-max-depth */}
                    <ThreadsListBlock />
                  </Box>
                </AppDrawer>
              </HiddenDesktop>
            </slots.listDrawer>
            <slots.listContainer>
              <ThreadsList />
            </slots.listContainer>
            <slots.threadsList {...slotProps.threadsList}>
              <ThreadsListBlock />
            </slots.threadsList>
            <ThreadComponent
              enableBranches={props.enableBranches}
              apiManager={apiManager}
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
