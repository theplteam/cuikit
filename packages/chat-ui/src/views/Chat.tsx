import * as React from 'react';
import ChatDialogueComponent from './ChatDialogueComponent';
import { ChatUsersProps, useChatProps } from './useChatProps';
import { ChatGlobalProvider } from './ChatGlobalContext';
import ChatAppDriver from './leftContainer/ChatAppDriver';
import Box from '@mui/material/Box';
import ChatDialoguesListBlock from './leftContainer/ChatDialoguesListBlock';
import DialoguesList from './leftContainer/DialoguesList';
import { HiddenDesktop } from '../ui/Responsive';
import ChatSnackbar from './ChatSnackbar';
import { ChatTheme } from './ChatTheme';
import { ChatDialogue } from '../models/ChatDialogue';

const Chat = <D extends ChatDialogue>(usersProps: React.PropsWithChildren<ChatUsersProps<D>>) => {
  const props = useChatProps(usersProps);

  return (
    <ChatTheme>
      {/** TODO: #ANY */}
      <ChatGlobalProvider props={props as any}>
        <props.slots.listDriver>
          <HiddenDesktop>
            <ChatAppDriver>
              <Box display={'flex'} flexDirection={'column'} height={500}>
                <ChatDialoguesListBlock />
              </Box>
            </ChatAppDriver>
          </HiddenDesktop>
        </props.slots.listDriver>
        <props.slots.list>
          <DialoguesList />
        </props.slots.list>
        <props.slots.dialogue>
          <ChatDialogueComponent
            contentRef={usersProps.scrollerRef}
          />
        </props.slots.dialogue>
        {usersProps.children}
      </ChatGlobalProvider>
      <ChatSnackbar />
    </ChatTheme>
  );
}

export default Chat;
