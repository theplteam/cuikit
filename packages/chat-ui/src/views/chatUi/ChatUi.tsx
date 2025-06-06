import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Chat from './../Chat';
import { useElementRef } from './../hooks/useElementRef';
import { ChatUsersProps } from './../core/useChatProps';
import { useMobile, useTablet } from './../../ui/Responsive';
import { ListContainer, ListContainerPortal } from './components/ListContainer';
import { MobileAppBarContainer, MobileAppBarContainerPortal } from './components/MobileAppBarContainer';
import ChatMobileAppBar from './components/ChatMobileAppBar';
import { Thread, Message } from './../../models';

export type ChatUiProps<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  listPlacement?: 'left' | 'right';
}> & ChatUsersProps<DM, DD>;

const ChatUi = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  const { slots, listPlacement = 'left', ...other } = usersProps;

  const ref = useElementRef();
  const isMobile = useMobile();
  const isTablet = useTablet();

  const listContainerComponent = React.useMemo(() => (
    <Grid
      container
      width="100%"
      sx={{
        display: isMobile ? 'none' : 'flex',
        maxWidth: isMobile ? 0 : isTablet ? 220 : 360,
        height: isMobile ? 0 : '100%',
      }}
    >
      <ListContainer />
    </Grid>
  ), [isMobile, isTablet]);

  return (
    <Grid
      container
      flexDirection={isMobile ? 'column' : 'row'}
      height="inherit"
      width="inherit"
      position="relative"
    >
      <Grid
        width="100%"
        sx={{
          maxWidth: isMobile ? '100%' : 0,
          height: isMobile ? 'auto' : 0,
          display: isMobile ? 'block' : 'none',
        }}
      >
        <MobileAppBarContainer />
      </Grid>
      {listPlacement === 'left' && listContainerComponent}
      <Grid
        ref={ref}
        flex={1}
        height="100%"
        width="100%"
        overflow="auto"
        position="relative"
      >
        <Chat
          scrollerRef={ref}
          slots={{
            listContainer: ListContainerPortal,
            ...slots,
          }}
          {...other}
        >
          <MobileAppBarContainerPortal>
            <ChatMobileAppBar />
          </MobileAppBarContainerPortal>
        </Chat>
      </Grid>
      {listPlacement === 'right' && listContainerComponent}
    </Grid >
  )
}

export default ChatUi;
