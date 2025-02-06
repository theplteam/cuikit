import * as React from 'react';
import { useElementRef } from './hooks/useElementRef';
import { useMobile } from '../ui/Responsive';
import Chat from './Chat';
import { DialogueAbstract } from './../models/DialogueAbstract';
import { ListContainer, ListContainerPortal } from './leftContainer/ListContainer';
import { MobileAppBarContainer, MobileAppBarContainerPortal } from './MobileAppBarContainer';
import Grid from '@mui/material/Grid2';
import { ChatUsersProps } from './core/useChatProps';

type Props<D extends DialogueAbstract> = {
  dialogues: D[];
  handleCreateChat: () => D;
  disableList?: boolean;
  disableMobileAppBar?: boolean;
} & Pick<ChatUsersProps<D>, 'slots' | 'slotProps' | 'coreSlots' | 'assistantActions' | 'userId' | 'lang' | 'licenseKey'>;

const ChatUi = <D extends DialogueAbstract>({ dialogues, handleCreateChat, disableList, disableMobileAppBar, slots, ...chatProps }: Props<D>) => {
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

  const currentSlots = React.useMemo(() => ({
    listContainer: slots?.listContainer ?? ListContainer,
    listContainerPortal: disableList ? undefined : slots?.listContainerPortal ?? ListContainerPortal,
    mobileAppBarContainer: slots?.mobileAppBarContainer ?? MobileAppBarContainer,
    mobileAppBarContainerPortal: disableMobileAppBar ? undefined : slots?.mobileAppBarContainerPortal ?? MobileAppBarContainerPortal,
  }), [slots, disableList, disableMobileAppBar]);

  return (
    <Grid flexDirection={{ xs: 'column', sm: 'row' }} container height={'inherit'} width={'inherit'} position={'relative'} >
      {(!disableList && !isMobile) && (
        <Grid container size={{ sm: 4, md: 3 }}>
          <currentSlots.listContainer />
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
          slots={{ ...currentSlots, ...slots }}
          {...chatProps}
        />
      </Grid>
      {(isMobile && !disableMobileAppBar) && (
        <Grid>
          <currentSlots.mobileAppBarContainer />
        </Grid>
      )}
    </Grid>
  )
}

export default ChatUi;
