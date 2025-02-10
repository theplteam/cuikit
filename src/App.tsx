import './App.css'
import { Chat } from 'chat-ui';
import Root from './test/Root.tsx';
import dialogues from './test/dialogues.json';
import { LeftContainer, LeftContainerPortal } from './test/LeftContainer.tsx';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useCustomAssistantActions } from './views/customAssistantActions';
import { HiddenDesktop, HiddenMobile, useMobile } from '../packages/chat-ui/src/ui/Responsive.tsx';
import HiddenContent from '../packages/chat-ui/src/views/HiddenContent.tsx';
import * as React from 'react';
import { useElementRef } from '../packages/chat-ui/src/views/hooks/useElementRef.tsx';
import MobileAppBar from './views/appBar/MobileAppBar.tsx';
import { ChatGptModel, ChatGptDialogueData } from './models/ChatGptModel.ts';
import ChatLicenseInfo from '../packages/chat-ui/src/views/license/ChatLicenseInfo.ts';

ChatLicenseInfo.setLicenseKey(import.meta.env.VITE_CHAT_UI_LICENSE_KEY);

function App() {
  const dd = dialogues as ChatGptDialogueData[];

  const openAi = React.useMemo(() => new ChatGptModel(), []);

  const customActions = useCustomAssistantActions();

  const ref = useElementRef();

  const isMobile = useMobile();
  return (
    <Root>
      <Stack
        direction={'row'}
        height={'inherit'}
        overflow={'scroll'}
        position={'relative'}
        ref={ref}
      >
        <HiddenMobile>
          <LeftContainer />
        </HiddenMobile>
        <Box
          width={'100%'}
          maxWidth={isMobile ? '100dvw' : 700}
          height={'100%'}
        >
          <Chat
            lang={'ru'}
            dialogues={dd}
            scrollerRef={ref}
            userId={20}
            handleStopMessageStreaming={openAi.stopStreaming}
            onUserMessageSent={openAi.streamMessage}
            slots={{
              list: isMobile ? HiddenContent : LeftContainerPortal,
            }}
            assistantActions={customActions}
          >
            <HiddenDesktop>
              <MobileAppBar />
            </HiddenDesktop>
          </Chat>
        </Box>
      </Stack>
    </Root>
  )
}

export default App
