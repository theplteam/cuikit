import * as React from 'react';
import Stack from '@mui/material/Stack';
import Chat from './../Chat';
import { useElementRef } from './../hooks/useElementRef';
import { ChatUsersProps } from './../core/useChatProps';
import { useMobile, useTablet } from './../../ui/Responsive';
import { ListContainer, ListContainerPortal } from './components/ListContainer';
import { MobileAppBarContainer, MobileAppBarContainerPortal } from './components/MobileAppBarContainer';
import ChatMobileAppBar from './components/ChatMobileAppBar';
import { Thread, Message } from './../../models';
import HiddenContent from '../../views/HiddenContent';

export type ChatUiProps<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  listPlacement?: 'left' | 'right';
}> & ChatUsersProps<DM, DD>;

const ChatUi = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  const { slots, listPlacement = 'left', ...other } = usersProps;

  const ref = useElementRef();
  const isMobile = useMobile();
  const isTablet = useTablet();

  const listContainerComponent = React.useMemo(() => !isMobile ? (
    <ListContainer
      width="100%"
      height="100%"
      sx={{
        maxWidth: isTablet ? 220 : 360,
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    />
  ) : null, [isMobile, isTablet]);

  return (
    <Stack
      key={isMobile ? 'mobile' : 'desktop'}
      flexDirection={{ xs: 'column', sm: 'row' }}
      height="inherit"
      width="inherit"
      position="relative"
    >
      {isMobile ? (
        <MobileAppBarContainer
          width="100%"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[200],
          }}
        />) : null}
      {listPlacement === 'left' && listContainerComponent}
      <Stack
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
            listContainer: isMobile ? HiddenContent : ListContainerPortal,
            ...slots,
          }}
          {...other}
        >
          {isMobile ? (
            <MobileAppBarContainerPortal>
              <ChatMobileAppBar />
            </MobileAppBarContainerPortal>
          ) : null}
        </Chat>
      </Stack>
      {listPlacement === 'right' && listContainerComponent}
    </Stack>
  )
}

export default ChatUi;
