import * as React from "react";
import {
  ChatPage,
  Thread,
  MessageSentParams,
  useChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const awaitSeconds = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Message status",
      messages: [
        {
          id: "u1",
          role: "user",
          content: "Hello!",
        },
        {
          id: "a1",
          parentId: "u1",
          role: "assistant",
          content: "Hello there! How can I assist you today?",
        },
        {
          id: "u2",
          parentId: "a1",
          role: "user",
          content: "Please run a long background task.",
        },
        {
          // Restored pending status: the chat shows it immediately on load and the
          // composer stays disabled until the host clears it.
          id: "a2",
          parentId: "u2",
          role: "assistant",
          content: "",
          initialStatus: "Please wait a little longer.",
        },
      ],
    },
  ]);

  const apiRef = useChatApiRef();

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    await awaitSeconds(2);
    params.setStatus("We've been waiting for 2 seconds already.");
    await awaitSeconds(3);
    params.setStatus("And another 3 seconds.");
    await awaitSeconds(3);
    params.setStatus("We're almost finished.");
    await awaitSeconds(1);

    params.setText("This was an example of waiting statuses for the assistant's response.");
    params.onFinish();
  }, []);

  // Simulate the background task for the message restored via `initialStatus`
  // completing: fill in the final text and clear the status + typing state.
  const finishRestoredMessage = React.useCallback(() => {
    apiRef.current?.setMessageText("The long task is finished.");
    apiRef.current?.setMessageStatus("", false);
  }, [apiRef]);

  return (
    <Box height="100dvh" width="100dvw">
      <Button
        variant="contained"
        sx={{ position: "fixed", top: 8, right: 8, zIndex: 2000 }}
        onClick={finishRestoredMessage}
      >
        {"Finish restored message"}
      </Button>
      <ChatPage
        apiRef={apiRef}
        defaultTextFieldValue="Test"
        initialThread={threads[0]}
        threads={threads}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
