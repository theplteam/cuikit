import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread, Chat, ChatApiRef, useChatApiRef, chatClassNames,
} from "@plteam/chat-ui";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";

const drawerWidth = 240;

const questionTemplates = [
  {
    id: '1',
    title: "Understanding ChatGPT",
    text: "Can you provide a detailed explanation of what ChatGPT is, including its underlying AI technology, how it processes natural language, and the various applications it supports?"
  },
  {
    id: '2',
    title: "Code Debugging Help",
    text: "Could you assist me in debugging and optimizing a complex code snippet? I would like a step-by-step explanation of any issues and suggestions for improvement, including alternative methods and best practices."
  },
  {
    id: '3',
    title: "Detailed Concept Explanation",
    text: "Please explain the concept of quantum computing in depth, covering its fundamental principles, key challenges, current research trends, and potential applications in various industries."
  },
  {
    id: '4',
    title: "Effective Language Learning",
    text: "Could you provide a detailed plan for learning a new language, outlining best practices, recommended resources, and strategies for mastering grammar, conversation, and cultural nuances?"
  },
  {
    id: '5',
    title: "Comprehensive Article Summary",
    text: "Could you provide a comprehensive summary of a research article by elaborating on its methodology, main findings, underlying arguments, and the broader implications of the study?"
  }
];

const MainBoxStyled = styled(Box)(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  height: `calc(100% - 64px)`,
  position: 'absolute',
  display: 'flex',
  top: 64,
  left: drawerWidth,
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    left: 0,
    width: '100%',
  },
  [`& .${chatClassNames.threadRoot}`]: {
    height: '100%',
  },
}));

const QuestionItemStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderLeft: `2px solid ${theme.palette.primary.main}`,
  cursor: 'pointer',
  transition: 'all 0.1s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const ToolsPanel: React.FC<{ apiRef: React.MutableRefObject<ChatApiRef>, handleDrawerClose: () => void }> = ({ apiRef, handleDrawerClose }) => {
  const sendMessage = React.useCallback((text: string) => {
    const longAwaitingAnswer = setTimeout(() => apiRef.current?.setProgressStatus('Please wait a little longer.'), 2500);

    apiRef.current?.sendUserMessage(text)
      .then(() => clearTimeout(longAwaitingAnswer));

    handleDrawerClose();
  }, [apiRef.current]);

  return (
    <>
      <Toolbar />
      <Divider />
      <Stack
        width={'100%'}
        gap={1.5}
        pt={2}
      >
        <Typography sx={{ pl: 1 }} fontWeight={'bold'}>
          Question templates:
        </Typography>
        <Stack>
          {questionTemplates.map((template) => (
            <QuestionItemStyled
              onClick={() => sendMessage(template.text)}
              key={template.id}
            >
              <Typography>{template.title}</Typography>
            </QuestionItemStyled>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Welcome message",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "You can select one of the question templates in the menu on the left, and it will be sent using the `sendUserMessage` function via `apiRef`.",
        },
      ],
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock({
      delayTimeout: 5000
    });

  const apiRef = useChatApiRef();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Chat UI
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={() => document.body}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <ToolsPanel apiRef={apiRef} handleDrawerClose={handleDrawerClose} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <ToolsPanel apiRef={apiRef} handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Box>
      <MainBoxStyled
        component="main"
        ref={scrollRef}
      >
        <Chat
          thread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          onUserMessageSent={onUserMessageSent}
          apiRef={apiRef}
          scrollerRef={scrollRef}
        />
      </MainBoxStyled>
    </Box>
  );
}

export default App;
