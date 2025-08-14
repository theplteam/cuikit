import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread,
  Chat,
  History,
  useChatApiRef,
} from "@plteam/chat-ui";
import Box from '@mui/material/Box';
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";

const historyClassname = 'example-chat-history';

const date = (new Date()).toISOString();

const threads: Thread[] = [
  {
    id: "1",
    title: "Traveling to Japan",
    date: date,
    messages: [
      {
        id: "1",
        content: "Hi! Do you know anything about traveling to Japan?",
        role: "user",
      },
      {
        id: "2",
        content: "Hi! Yes, I know a bit. What specifically do you want to know? Transportation, culture, or something else?",
        role: "assistant",
      },
      {
        id: "3",
        content: "I'm curious about transportation. How does the train system work?",
        role: "user",
      },
      {
        id: "4",
        content: "Japan has an excellent train system. There are high-speed trains called Shinkansen connecting major cities, and regional lines are great for shorter trips.",
        role: "assistant",
      },
    ],
  },
  {
    id: "2",
    title: "Small talk",
    date: date,
    messages: [
      {
        role: "user",
        content: "Hello, how are you today?",
      },
      {
        role: "assistant",
        content: "Hi there! I'm doing great, thanks for asking. What can I help you with this morning?",
      },
    ],
  },
];

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [activeThreadName, setActiveThreadName] = React.useState<string>(threads[0].title);

  const apiRef = useChatApiRef();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const onChangeCurrentThread = (params: { thread: Thread | undefined }) => {
    setActiveThreadName(params.thread?.title || '');
    handleDrawerClose();
  };

  return (
    <Box
      height="100vh"
      width="100vw"
    >
      <AppBar>
        <Toolbar sx={{ gap: 6, justifyContent: 'space-between' }}>
          <Typography noWrap variant="h6" component="div">
            {activeThreadName}
          </Typography>
          <IconButton color='inherit' onClick={toggleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        keepMounted
        open={drawerOpen}
        anchor="right"
        sx={{
          [`& .${historyClassname}`]: {
            width: isMobile ? 200 : 400,
            maxWidth: 'none',
          }
        }}
        onClose={handleDrawerClose}
      >
        <History apiRef={apiRef} className={historyClassname} />
      </Drawer>
      <Box
        width="100%"
        height='calc(100vh - 64px)'
        overflow="auto"
        paddingTop={8}
      >
        <Chat
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          apiRef={apiRef}
          scrollerRef={scrollRef}
          onUserMessageSent={onUserMessageSent}
          onChangeCurrentThread={onChangeCurrentThread}
        />
      </Box>
    </Box>
  );
};

export default App;
