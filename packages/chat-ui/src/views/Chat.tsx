import * as React from 'react';
import ThreadComponent from './thread/ThreadComponent';
import { ChatUsersProps, useChatProps } from './core/useChatProps';
import { ChatGlobalProvider } from './core/ChatGlobalContext';
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
        props={props}
        apiManager={apiManager}
      >
        <LocalizationProvider locale={usersProps.lang}>
          <ChatSlotsProvider slots={slots} coreSlots={coreSlots} slotProps={slotProps}>
            <ThreadComponent
              initialThread={props.initialThread}
              enableBranches={props.enableBranches}
              apiManager={apiManager}
              contentRef={usersProps.scrollerRef}
              loading={usersProps.loading}
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
