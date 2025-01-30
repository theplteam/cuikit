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
import { CustomDialogue, DCustomDialogue } from './models/CustomDialogue.ts';

function App() {
  const dd: DCustomDialogue[] = dialogues as DCustomDialogue[];

  const testArray = React.useMemo(() => dd.map(v => new CustomDialogue(
    v,
    {
      authCode: '',
    }
  )), []);

  const [dialogue, setDialogue] = React.useState(([...testArray].sort((a,b) => b.timestamp.value - a.timestamp.value))[0]);

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
            lang={'ru'}
            dialogues={testArray}
            setDialogue={setDialogue}
            scrollerRef={ref}
            userId={20}
            modelProps={{
              openNew: () => {
                const newDialogue = new CustomDialogue(
                  {
                    id: '1-2-3',
                    title: 'newDialogue',
                    messages: [],
                    authorId: 1,
                  },
                  {
                    authCode: '',
                  }
                );

                setDialogue(newDialogue);
              },
              open: (dialogue) => setDialogue(dialogue),
            }}
            slots={{
              list: isMobile ? HiddenContent : LeftContainerPortal
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
