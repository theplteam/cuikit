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

export type ChatUiProps<DM extends Message, DD extends Thread<DM>> = React.PropsWithChildren<{
  listPlacement?: 'left' | 'right';
}> & ChatUsersProps<DM, DD>;

const ChatUi = <DM extends Message, DD extends Thread<DM>>(usersProps: ChatUiProps<DM, DD>) => {
  const { slots, listPlacement = 'left', ...other } = usersProps;

  const ref = useElementRef();
  const isMobile = useMobile();
  const isTablet = useTablet();

  const listContainerComponent = React.useMemo(() => (
    <ListContainer isMobile={isMobile} isTablet={isTablet} />
  ), [isMobile, isTablet]);

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      height="inherit"
      width="inherit"
      position="relative"
    >
      <MobileAppBarContainer isMobile={isMobile} />
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
            listContainer: ListContainerPortal,
            ...slots,
          }}
          {...other}
        >
          <MobileAppBarContainerPortal>
            <ChatMobileAppBar />
          </MobileAppBarContainerPortal>
        </Chat>
      </Stack>
      {listPlacement === 'right' && listContainerComponent}
    </Stack>
  )
}

export default ChatUi;
