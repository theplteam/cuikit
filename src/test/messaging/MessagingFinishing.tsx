import * as React from "react";
import {
  ChatPage,
  Thread, useChatApiRef, MessageSentParams, useAssistantAnswerMock, ChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SendMessageRow: React.FC<{ apiRef: React.RefObject<ChatApiRef> }> = ({ apiRef }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await apiRef.current?.sendUserMessage('Run test');
    setIsLoading(false);
  };
  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Button
        disabled={isLoading}
        variant="contained"
        sx={{ width: "min(70%, 300px)" }}
        onClick={onClick}
      >
        {"Send test Message\r"}
      </Button>
    </Box>
  );
}

const App: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Messaging test",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Hello! Click the \"Send Message\" button to test the `onFinish` function.\n\nFor the user, the stream will finish sooner, so they won't have to wait for any technical information.",
        },
      ],
    },
  ]);

  const { streamGenerator } = useAssistantAnswerMock()

  const openSnackbar = (text: string) => {
    setText(text);
    setOpen(true);
  };

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    openSnackbar('Message sent!');

    const stream = streamGenerator(undefined, { delay: 100 });

    for await (const chunk of stream) {
      params.pushChunk(chunk ?? '');
    }

    openSnackbar('Text received, calling onFinish, but function execution continues');
    params.onFinish();

    // Receiving some additional data
    await new Promise(resolve => setTimeout(resolve, 5000));
    openSnackbar('Stream completed');
  }, []);

  const apiRef = useChatApiRef();

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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

  return (
    <>
      <Box height="100dvh" width="100dvw">
        <ChatPage
          thread={threads[0]}
          threads={threads}
          apiRef={apiRef}
          slots={{
            messageRowInner: SendMessageRow,
          }}
          slotProps={{
            messageRowInner: { apiRef },
          }}
          onUserMessageSent={onUserMessageSent}
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
