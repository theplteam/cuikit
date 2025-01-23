import './App.css'
import { Chat, ChatDialogue, ChatDialogueTypeEnum, DChatDialogue } from 'chat-ui';
import { NOOP } from '../packages/chat-ui/src/utils/NOOP.ts';
import Root from './test/Root.tsx';
import dialogues from './test/dialogues.json';
import { LeftContainer, LeftContainerPortal } from './test/LeftContainer.tsx';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useCustomAssistantActions } from './customAssistantActions';
import { HiddenMobile, useMobile } from '../packages/chat-ui/src/ui/Responsive.tsx';
import HiddenContent from '../packages/chat-ui/src/views/HiddenContent.tsx';
import * as React from 'react';
import { useElementRef } from '../packages/chat-ui/src/views/hooks/useElementRef.tsx';

function App() {
  const testArray = React.useMemo(() => (dialogues as DChatDialogue[]).map(v => new ChatDialogue(
    v,
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
            lang={'ru'}
            dialogues={testArray}
            setDialogue={setDialogue}
            scrollerRef={ref}
            modelProps={{
              openNew: () => {
                const newDialogue = new ChatDialogue(
                  {
                    id: '1-2-3',
                    title: 'newDialogue',
                    messages: [],
                    authorId: 1,
                    dialogType: ChatDialogueTypeEnum.NEWS_LIST,
                  },
                  NOOP,
                  {
                    getMessageUrl: () => '',
                    authCode: '',
                    openDialogue: NOOP,
                  }
                );

                setDialogue(newDialogue);
              },
            }}
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
