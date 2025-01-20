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

const Chat: React.FC<React.PropsWithChildren<ChatUsersProps>> = (usersProps) => {
  const props = useChatProps(usersProps);

  return (
    <ChatTheme>
      <ChatGlobalProvider props={props}>
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
      </ChatGlobalProvider>
      <ChatSnackbar />
    </ChatTheme>
  );
}

export default Chat;
