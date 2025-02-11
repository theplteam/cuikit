import * as React from 'react';
import Grid from '@mui/material/Grid';
import Chat from './../Chat';
import { useElementRef } from './../hooks/useElementRef';
import { ChatUsersProps } from './../core/useChatProps';
import { useMobile } from './../../ui/Responsive';
import HiddenContent from './../HiddenContent';
import { ListContainer, ListContainerPortal } from './components/ListContainer';
import { MobileAppBarContainer, MobileAppBarContainerPortal } from './components/MobileAppBarContainer';
import ChatMobileAppBar from './components/ChatMobileAppBar';
import { DDialogue, DMessage } from './../../models';

const ChatUi = <DM extends DMessage, DD extends DDialogue<DM>>(usersProps: React.PropsWithChildren<ChatUsersProps<DM, DD>>) => {
  const { slots, ...other } = usersProps;

  const ref = useElementRef();
  const isMobile = useMobile();

  return (
    <Grid flexDirection={{ xs: 'column', sm: 'row' }} container height={'inherit'} width={'inherit'} position={'relative'}>
      {!isMobile && (
        <Grid container width={'100%'} maxWidth={360}>
          <ListContainer />
        </Grid>
      )}
      <Grid ref={ref} flex={1} height={'100%'} width={'100%'} maxWidth={700} overflow={'auto'} position={'relative'}>
        <Chat
          scrollerRef={ref}
          slots={{
            list: isMobile ? HiddenContent : ListContainerPortal,
            ...slots,
          }}
          {...other}
        >
          {isMobile && (
            <MobileAppBarContainerPortal>
              <ChatMobileAppBar />
            </MobileAppBarContainerPortal>
          )}
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
