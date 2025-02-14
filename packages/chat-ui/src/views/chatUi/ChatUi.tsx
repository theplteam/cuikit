import * as React from 'react';
import Grid from '@mui/material/Grid';
import Chat from './../Chat';
import { useElementRef } from './../hooks/useElementRef';
import { ChatUsersProps } from './../core/useChatProps';
import { useMobile, useTablet } from './../../ui/Responsive';
import HiddenContent from './../HiddenContent';
import { ListContainer, ListContainerPortal } from './components/ListContainer';
import { MobileAppBarContainer, MobileAppBarContainerPortal } from './components/MobileAppBarContainer';
import ChatMobileAppBar from './components/ChatMobileAppBar';
import { DDialogue, DMessage } from './../../models';

export type ChatUiProps<DM extends DMessage, DD extends DDialogue<DM>> = React.PropsWithChildren<{
  listPlacement?: 'left' | 'right';
}> & ChatUsersProps<DM, DD>;

const ChatUi = <DM extends DMessage, DD extends DDialogue<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  const { slots, listPlacement = 'left', ...other } = usersProps;

  const ref = useElementRef();
  const isMobile = useMobile();
  const isTablet = useTablet();

  const listContainerComponent = React.useMemo(() => isMobile
    ? null
    : (
      <Grid item container width={'100%'} maxWidth={isTablet ? 220 : 360}>
        <ListContainer />
      </Grid>
    ), [isMobile, isTablet]);

  return (
    <Grid flexDirection={{ xs: 'column', sm: 'row' }} container height={'inherit'} width={'inherit'} position={'relative'}>
      {isMobile && (
        <Grid>
          <MobileAppBarContainer />
        </Grid>
      )}
      {listPlacement === 'left' && listContainerComponent}
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
      {listPlacement === 'right' && listContainerComponent}
    </Grid>
  )
}

export default ChatUi;
