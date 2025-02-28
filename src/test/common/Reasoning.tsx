import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread, Chat, useChatApiRef, chatClassNames, useChatContext,
  MessageSentParams,
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
import { Portal } from '@mui/base/Portal';
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

const MainBoxStyled = styled(Box)(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  height: `calc(100% - 64px)`,
  position: 'absolute',
  display: 'flex',
  top: 64,
  left: drawerWidth,
  overflowY: 'scroll',
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
        <IconButton sx={{ display: { sm: 'none' } }} onClick={handleDrawerClose}>
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
          content: "Hello there! How can I assist you today?",
        },
      ],
    },
  ]);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const apiRef = useChatApiRef();

  const { streamGenerator, handleStopMessageStreaming, reasoningGenerator } =
    useAssistantAnswerMock();

  const onUserMessageSent = async (params: MessageSentParams) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const reasoningStream = reasoningGenerator();

    for await (const reasoningChunk of reasoningStream) {
      params.pushReasoningChunk(reasoningChunk);
    }

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }
  }

  React.useEffect(() => {
    (new Promise(resolve => setTimeout(resolve, 1000)))
      .then(() => {
        apiRef.current?.sendUserMessage('test');
      });
  }, []);

  const toolsContainerRef = React.useRef<HTMLDivElement | null>(null);

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
            {"Chat UI\r"}
          </Typography>
        </Toolbar>
      </AppBar>
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
          enableReasoning
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
        />
      </MainBoxStyled>
    </Box>
  );
}

export default App;
