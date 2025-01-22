import './App.css'
import { Chat, ChatDialogue, DChatDialogue } from 'chat-ui';
import { NOOP } from '../packages/chat-ui/src/utils/NOOP.ts';
import Root from './test/Root.tsx';
import testDialogues from './test/testDialogues.json';
import { LeftContainer, LeftContainerPortal } from './test/LeftContainer.tsx';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useCustomAssistantActions } from './customAssistantActions';
import { HiddenMobile, useMobile } from '../packages/chat-ui/src/ui/Responsive.tsx';
import HiddenContent from '../packages/chat-ui/src/views/HiddenContent.tsx';
import * as React from 'react';
import { useElementRef } from '../packages/chat-ui/src/views/hooks/useElementRef.tsx';

function App() {
  const testArray = React.useMemo(() => testDialogues.map(v => new ChatDialogue(
    v as DChatDialogue,
    NOOP,
    {
      getMessageUrl: () => '',
      authCode: '',
      openDialogue: NOOP,
    }
  )), []);

  const [dialogue, setDialogue] = React.useState(testArray[0]);

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
            dialogue={dialogue}
            dialogues={testArray}
            setDialogue={setDialogue}
            scrollerRef={ref}
            slots={{
              list: isMobile ? HiddenContent : LeftContainerPortal
            }}
            assistantActions={customActions}
          />
        </Box>
      </Stack>
    </Root>
  )
}

export default App
