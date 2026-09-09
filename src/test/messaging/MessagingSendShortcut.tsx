import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  SendMessageShortcut,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

const App: React.FC = () => {
  const [shortcut, setShortcut] = React.useState<SendMessageShortcut>('enter');

  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Send shortcut",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Switch the send shortcut above and try typing a multi-line message.\n\n- **Enter** — Enter sends, Shift+Enter adds a new line.\n- **Ctrl+Enter** — Ctrl+Enter (Cmd+Enter on macOS) sends, Enter adds a new line.",
        },
      ],
    },
  ]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box
      height="100dvh" width="100dvw" display="flex"
      flexDirection="column"
    >
      <Box
        display="flex" alignItems="center" gap={2}
        p={1}
      >
        <Typography variant="body2">
          {"Send message with:"}
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={shortcut}
          onChange={(_event, value: SendMessageShortcut | null) => {
            if (value) setShortcut(value);
          }}
        >
          <ToggleButton value="enter">
            {"Enter"}
          </ToggleButton>
          <ToggleButton value="ctrlEnter">
            {"Ctrl + Enter"}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* ChatPage inherits `height` from its parent, so the wrapper needs an explicit one */}
      <Box flex={1} height="100%" minHeight={0}>
        <ChatPage
          // Chat props are read once on mount, so remount the chat when the shortcut changes
          key={shortcut}
          initialThread={threads[0]}
          threads={threads}
          sendMessageShortcut={shortcut}
          handleStopMessageStreaming={handleStopMessageStreaming}
          onUserMessageSent={onUserMessageSent}
        />
      </Box>
    </Box>
  );
}

export default App;
