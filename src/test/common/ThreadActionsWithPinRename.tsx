import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import ShareIcon from "@mui/icons-material/Share";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

let counter = 0;

const ShareAction: React.FC<{ thread: Thread; onClose: () => void }> = ({ thread, onClose }) => {
  const handleClick = () => {
    alert(`Sharing thread: ${thread.title}`);
    onClose();
  };

  return (
    <MenuItem onClick={handleClick}>
      <ShareIcon fontSize="small" sx={{ mr: 1 }} />
      {`Share`}
    </MenuItem>
  );
};

const App: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  const openSnackbar = (message: string) => {
    setText(message);
    setOpen(true);
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const [threads] = React.useState<Thread[]>([
    {
      id: "thread-1",
      title: "Second thread",
      date: (new Date('2025-01-18T12:00:00.000Z')).toISOString(),
      messages: [
        { role: "user", content: { type: "text", text: "Hello!" } },
        { role: "assistant", content: "Hello there! How can I assist you today?" },
      ],
    },
    {
      id: "thread-2",
      title: "First thread",
      date: (new Date('2024-12-12T12:00:00.000Z')).toISOString(),
      messages: [
        { role: "user", content: "Hello, how are you today?" },
        { role: "assistant", content: "Hi there! I'm doing great, thanks for asking." },
      ],
    },
  ]);

  const handleCreateNewThread = (): Thread => {
    counter++;
    openSnackbar(`Opened a new thread #${counter}`);
    return {
      id: `thread-new-${counter}`,
      title: `Thread #${counter}`,
      messages: [],
      date: new Date().toISOString(),
    };
  };

  const { onUserMessageSent, handleStopMessageStreaming } = useAssistantAnswerMock();

  const snackBarActions = (
    <IconButton size="small" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <>
      <Box height="100dvh" width="100dvw">
        <ChatPage
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          handleCreateNewThread={handleCreateNewThread}
          onUserMessageSent={onUserMessageSent}
          historyProps={{
            enableDialogueRename: true,
            enableThreadPin: true,
            onPinThread: (threadId, pinnedAt) => {
              openSnackbar(pinnedAt ? `Pinned thread ${threadId}` : `Unpinned thread ${threadId}`);
            },
            threadActions: [ShareAction],
          }}
        />
      </Box>
      <Snackbar
        action={snackBarActions}
        message={text}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default App;
