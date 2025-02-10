import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Chat from './../Chat';
import { useElementRef } from './../hooks/useElementRef';
import { ChatUsersProps } from './../core/useChatProps';
import { useMobile } from './../../ui/Responsive';
import { DialogueAbstract } from './../../models/DialogueAbstract';
import HiddenContent from './../HiddenContent';
import { ListContainer, ListContainerPortal } from './components/ListContainer';
import { MobileAppBarContainer, MobileAppBarContainerPortal } from './components/MobileAppBarContainer';
import ChatMobileAppBar from './components/ChatMobileAppBar';

export type ChatUiProps<D extends DialogueAbstract> = {
  dialogues: D[];
  handleCreateChat: () => D;
  disableList?: boolean;
  disableMobileAppBar?: boolean;
} & Pick<ChatUsersProps<D>, 'slots' | 'slotProps' | 'coreSlots' | 'assistantActions' | 'userId' | 'lang'>;

const ChatUi = <D extends DialogueAbstract>({ dialogues, handleCreateChat, slots, ...chatProps }: ChatUiProps<D>) => {
  const [currentDialogue, setCurrentDialogue] = React.useState(dialogues[0]);

  const ref = useElementRef();
  const isMobile = useMobile();

  const handleOpenNewChat = () => {
    const newChat = handleCreateChat();
    setCurrentDialogue(newChat);
  }

  const handleOpenChat = (dialogue: D) => {
    setCurrentDialogue(dialogue)
  }

  return (
    <Grid flexDirection={{ xs: 'column', sm: 'row' }} container height={'inherit'} width={'inherit'} position={'relative'} >
      {!isMobile && (
        <Grid container size={{ sm: 4, md: 3 }}>
          <ListContainer />
        </Grid>
      )}
      <Grid ref={ref} flex={1} maxHeight={'100%'} width={'100%'} overflow={'scroll'}>
        <Chat
          dialogue={currentDialogue}
          setDialogue={setCurrentDialogue}
          dialogues={dialogues}
          scrollerRef={ref}
          modelProps={{
            openNew: handleOpenNewChat,
            open: handleOpenChat,
          }}
          slots={{
            list: isMobile ? HiddenContent : ListContainerPortal,
            ...slots,
          }}
          {...chatProps}
        >
          <MobileAppBarContainerPortal>
            <ChatMobileAppBar />
          </MobileAppBarContainerPortal>
        </Chat>
      </Grid>
      {isMobile && (
        <Grid>
          <MobileAppBarContainer />
        </Grid>
      )}
    </Grid>
  )
}

export default ChatUi;
