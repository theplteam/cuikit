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
        gap={1.5}
        pt={2}
        width="100%"
      >
        <Typography fontWeight="bold" sx={{ pl: 1 }}>
          {"Question templates:"}
        </Typography>
        <Stack>
          {questionTemplates.map((template) => (
            <QuestionItemStyled
              key={template.id}
              onClick={() => sendMessage(template.text)}
            >
              <Typography>
                {template.title}
              </Typography>
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
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap component="div" variant="h6">
            {"Chat UI\r"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={() => document.body}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          open={mobileOpen}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          variant="temporary"
          onClose={handleDrawerClose}
          onTransitionEnd={handleDrawerTransitionEnd}
        >
          <ToolsPanel apiRef={apiRef} handleDrawerClose={handleDrawerClose} />
        </Drawer>
        <Drawer
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          variant="permanent"
        >
          <ToolsPanel apiRef={apiRef} handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Box>
      <MainBoxStyled
        ref={scrollRef}
        component="main"
      >
        <Chat
          apiRef={apiRef}
          handleStopMessageStreaming={handleStopMessageStreaming}
          scrollerRef={scrollRef}
          thread={threads[0]}
          threads={threads}
          onUserMessageSent={onUserMessageSent}
        />
      </MainBoxStyled>
    </Box>
  );
}

export default App;
