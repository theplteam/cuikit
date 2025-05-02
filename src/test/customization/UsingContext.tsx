import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread, Chat, useChatApiRef, chatClassNames, useChatContext,
} from "@plteam/chat-ui";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled, useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Portal } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import { useObserverValue } from '../../../packages/chat-ui/src/views/hooks/useObserverValue.tsx';

const drawerWidth = 240;

const date = moment().utc().format('HH:mm:ss [as of] MMMM D, YYYY');

const threadsDataArray = [
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
        content: "Hello there! How can I assist you today?",
      },
    ],
  },
  {
    id: "test-thread-1",
    title: "Conversation with assistant",
    messages: [
      {
        role: "user",
        content: "Hi, how are you?!",
      },
      {
        role: "assistant",
        content: "Hi there! I'm here and ready to help. How can I assist you today?",
      },
    ],
  },
  {
    id: "test-thread-2",
    title: "User's question",
    messages: [
      {
        role: "user",
        content: "What time is it?",
      },
      {
        role: "assistant",
        content: `I don't have direct access to your local clock or time zone. However, the system’s timestamp (in UTC) shows ${date}. If you're in a different time zone, you'll need to adjust accordingly. Would you like help converting this to your local time?`,
      },
    ],
  },
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

type ToolsPanelProps = React.PropsWithChildren<{
  handleDrawerClose: () => void;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}>;

const ToolsPanelPortal: React.FC<ToolsPanelProps> = ({ handleDrawerClose, children, containerRef }) => {
  const { apiRef } = useChatContext();

  const onOpenNew = React.useCallback(() => {
    apiRef.current?.openNewThread();
    handleDrawerClose();
  }, [apiRef.current]);

  return (
    <Portal
      container={() => containerRef.current!}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          sx={{
            display: { sm: 'none' },
          }}
          onClick={handleDrawerClose}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <Stack
        gap={2}
      >
        <Box px={1.5} mt={2}>
          <Button
            fullWidth
            startIcon={<AddIcon />}
            variant="contained"
            onClick={onOpenNew}
          >
            {"Open new thread\r"}
          </Button>
        </Box>
        <Typography sx={{ pl: 1 }} fontWeight="bold">
          {"Threads list\r"}
        </Typography>
        {children}
      </Stack>
    </Portal>
  );
};

const ChatAppBar: React.FC<{ handleDrawerToggle: () => void }> = ({ handleDrawerToggle }) => {
  const { model } = useChatContext();

  const thread = useObserverValue(model.currentThread);

  const title = thread?.title || 'Chat UI';
  return (
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
        <Typography noWrap variant="h6" component="div">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsDataArray);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const toolsContainerRef = React.useRef<HTMLDivElement | null>(null);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock({
      delayTimeout: 5000
    });

  const apiRef = useChatApiRef();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = React.useState(true);
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'persistent' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#F1F4F9',
            },
          }}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
        >
          <Box ref={toolsContainerRef} />
        </Drawer>
      </Box>
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
          slots={{
            threadsList: ToolsPanelPortal,
          }}
          slotProps={{
            threadsList: {
              handleDrawerClose,
              containerRef: toolsContainerRef,
            },
          }}
          onUserMessageSent={onUserMessageSent}
          onChangeCurrentThread={handleDrawerClose}
        >
          <ChatAppBar handleDrawerToggle={handleDrawerToggle} />
        </Chat>
      </MainBoxStyled>
    </Box>
  );
}

export default App;
