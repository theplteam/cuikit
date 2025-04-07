import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread, Chat, useChatApiRef, chatClassNames,
} from "@plteam/chat-ui";
import Box from '@mui/material/Box';
import { styled } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const assisatntMessageContent = `
I’m designed to understand and generate human-like text based on the input I receive. Here are some of my key capabilities:

1. Conversation and Q&A: I can answer questions across a wide range of topics, explain complex concepts, and engage in back-and-forth dialogue on nearly any subject.

2. Creative and Technical Writing: Whether you need help drafting an email, writing a story, or even composing code, I can generate text in various styles and formats. I can also help with editing and refining your text.

3. Problem Solving: I can assist with analyzing problems, brainstorming solutions, summarizing information, and even tackling mathematical or logical puzzles.

4. Multilingual Support: I’m capable of working in several languages, translating text, or helping you learn about language nuances.

5. Learning and Information: I draw from a vast pool of generalized knowledge, which means I can provide context, historical background, technical details, and more on many topics. (That said, while I strive for accuracy, it’s good to verify specific details if they’re critical.)

6. Adaptability: I can adjust the tone and style of my responses based on your needs, whether you’d prefer a formal explanation, a casual conversation, or something creative.

While I have these versatile capabilities, I also have limitations. I don’t have real-time access to current events or internet browsing capabilities, and my knowledge is up-to-date only until a specific cutoff. Additionally, although I try to provide accurate and helpful information, I might not always fully capture the nuances of highly specialized or rapidly changing fields. 

If you have any more questions or need help with something specific, feel free to ask!
`;

const MainBoxStyled = styled(Box)(({ theme }) => ({
  width: `100%`,
  height: `calc(100% - 64px)`,
  position: 'absolute',
  display: 'flex',
  top: 64,
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    left: 0,
    width: '100%',
  },
  [`& .${chatClassNames.threadRoot}`]: {
    height: '100%',
  },
}));

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Welcome message",
      messages: [
        {
          role: "user",
          content: "Describe your capabilities",
        },
        {
          role: "assistant",
          content: assisatntMessageContent,
        },
      ],
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock({ loremIpsumSize: 'large' });

  const apiRef = useChatApiRef();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Toolbar sx={{ maxWidth: 700, width: '100%', boxSizing: 'border-box' }}>
          <Typography noWrap variant="h6" component="div">
            {"Chat UI\r"}
          </Typography>
        </Toolbar>
      </AppBar>
      <MainBoxStyled
        ref={scrollRef}
        component="main"
      >
        <Chat
          thread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          apiRef={apiRef}
          scrollerRef={scrollRef}
          onUserMessageSent={onUserMessageSent}
        />
      </MainBoxStyled>
    </Box>
  );
}

export default App;
