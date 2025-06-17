import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  onShowAlertType,
  FileAttachedParams,
} from "@plteam/chat-ui";
import { SnackbarProvider, useSnackbar } from 'notistack';
import Box from "@mui/material/Box";

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Snackbar",
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'Hello! I see that non-standard snackbars are being used in this chat.',
          },
          {
            id: '2',
            content: 'Hello, that\'s absolutely correct, this chat uses `onShowAlert` to display an external snackbar.',
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { enqueueSnackbar } = useSnackbar();

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const onShowAlert: onShowAlertType = (text, type) => {
    enqueueSnackbar(text, { variant: type });
  }

  const onFileAttached = ({ file }: FileAttachedParams) => {
    onShowAlert(`File ${file.name} uploaded`, 'info');
  };

  const onFileDetached = () => {
    onShowAlert('File deleted', 'info');
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        maxFileSize={5 * 1024 * 1024}
        maxFileCount={3}
        acceptableFileFormat={["image", "application/pdf"]}
        onUserMessageSent={onUserMessageSent}
        onFileAttached={onFileAttached}
        onFileDetached={onFileDetached}
        onShowAlert={onShowAlert}
      />
    </Box>
  );
}

const ExternalSnackbar: React.FC = () => (
  <SnackbarProvider maxSnack={5}>
    <App />
  </SnackbarProvider>
);

export default ExternalSnackbar;
