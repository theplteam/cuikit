import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

let counter = 0;

const App: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  const openSnackbar = (text: string) => {
    setText(text);
    setOpen(true);
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Second thread",
      date: (new Date('2025-01-18T12:00:00.000Z')).toISOString(),
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Hello!",
          },
        },
        {
          role: "assistant",
          content: "Hello there! How can I assist you today?",
        },
      ],
    },
    {
      id: "test-thread2",
      title: "First thread",
      date: (new Date('2024-12-12T12:00:00.000Z')).toISOString(),
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
  ]);

  const onFirstMessageSent = ({ thread }: { thread: Thread }) => {
    openSnackbar(`The first message in thread "${thread.title}" has been sent`);
  }

  const onThreadDeleted = ({ thread }: { thread: Thread }) => {
    openSnackbar(`Thread deleted: ${thread.title}`);
  }

  const onChangeCurrentThread = ({ thread }: { thread: Thread }) => {
    openSnackbar(`Current thread changed: ${thread.title}`);
  }

  const handleCreateNewThread = (): Thread => {
    openSnackbar('Opened a new thread with our data');
    counter++;
    return ({
      id: `thread${counter}`,
      title: `Thread #${counter}`,
      messages: [],
      date: new Date().toISOString(),
    });
  }

  const snackBarActions = React.useMemo(() => (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  ), [handleClose]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <>
      <Box height="100dvh" width="100dvw">
        <ChatPage
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          handleCreateNewThread={handleCreateNewThread}
          onUserMessageSent={onUserMessageSent}
          onFirstMessageSent={onFirstMessageSent}
          onThreadDeleted={onThreadDeleted}
          onChangeCurrentThread={onChangeCurrentThread}
        />
      </Box>
      <Snackbar
        open={open}
        message={text}
        action={snackBarActions}
        onClose={handleClose}
      />
    </>
  );
}

export default App;
