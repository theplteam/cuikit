import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread,
  ChatPage,
} from "@plteam/chat-ui";
import Box from '@mui/material/Box';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

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
];

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsDataArray);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const toggleTheme = () => {
    setTheme('light')
  };
  console.log('theme', theme);
  return (
    <Box width="100vw" height="100vh">
      <AppBar>
        <Toolbar>
          <IconButton onClick={toggleTheme}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box width="100%" height="100%">
        <ChatPage
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          getConversationBlockHeightMin={(calc) => calc - 64}
          onUserMessageSent={onUserMessageSent}
        />
      </Box>
    </Box>
  );
}

export default App;
