import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, DMessage,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import SaveIcon from "@mui/icons-material/Save";

const saveTextAsFile = (text: string, filename: string) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const SaveTextButton = (props: { message: Extract<DMessage, { role: 'assistant' }> }) => {
  const { content } = props.message;
  const text = typeof content === 'string' ? content : content[0].text;

  return (
    <IconButton
      onClick={() => saveTextAsFile(text, 'testfile.txt')}
    >
      <SaveIcon />
    </IconButton>
  );
}

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

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatPage
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        disableMessageCopying
        assistantActions={[SaveTextButton]}
      />
    </Box>
  );
}

export default App;
