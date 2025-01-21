import './App.css'
import { Chat, ChatDialogue, ChatDialogueTypeEnum, DChatDialogue } from 'chat-ui';
import { NOOP } from '../packages/chat-ui/src/utils/NOOP.ts';
import Root from './test/Root.tsx';
import testData from './test/testMessages.json';
import { LeftContainer, LeftContainerPortal } from './test/LeftContainer.tsx';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useCustomAssistantActions } from './customAssistantActions';
import { HiddenMobile, useMobile } from '../packages/chat-ui/src/ui/Responsive.tsx';
import HiddenContent from '../packages/chat-ui/src/views/HiddenContent.tsx';

function App() {
  const testArray = [
    new ChatDialogue(
      {
        id: '1-2-3',
        title: 'testDialogue',
        dialogType: ChatDialogueTypeEnum.NEWS_LIST,
        messages: testData as DChatDialogue['messages'],
        authorId: 1,
      },
      NOOP,
      {
        getMessageUrl: () => '',
        authCode: '',
        openDialogue: NOOP,
      }
    )
  ];

  const customActions = useCustomAssistantActions();

  const isMobile = useMobile();
  return (
    <Root>
      <Stack
        direction={'row'}
        height={'100%'}
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
            dialogue={testArray[0]}
            dialogues={testArray}
            setDialogue={() => {}}
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
