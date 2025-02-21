import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';

const markdownString = `
# Heading level 1
            
## Heading level 2

### Heading level 3

Quote:

> Lorem ipsum odor amet, consectetuer adipiscing elit.
> Purus rhoncus donec maecenas conubia parturient odio vivamus.
> Augue vehicula mattis ex quisque malesuada.
> Ante fames pharetra cras lorem sociosqu himenaeos placerat quis nam. 
`;

const BlockquoteStyled = styled('blockquote')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  backgroundColor: '#fff0de',
  borderLeft: `4px solid`,
  borderColor: '#fdcf74',
  borderRadius: 6,
  color: '#333333',
  'p': {
    whiteSpace: 'break-spaces',
  }
}))

const App: React.FC = () => {
  const [dialogues] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Base syntax",
        messages: [
          {
            content: "Hello! Show me how you render markdown",
            role: "user",
          },
          {
            content: markdownString,
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatPage
        dialogue={dialogues[0]}
        dialogues={dialogues}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        slots={{
          markdownBlockquote: BlockquoteStyled,
        }}
        slotProps={{
          markdownH1: {
            variant: "h4",
            color: "primary",
          },
          markdownH2: {
            variant: "h5",
            color: "primary",
          },
          markdownH3: {
            variant: "h6",
            color: "primary",
          },
        }}
      />
    </Box>
  );
}

export default App;
