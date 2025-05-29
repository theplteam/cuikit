import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { FileAttachedParams } from "../../../packages/chat-ui/src/models/FileAttachedParams";

const FileAttachmentError: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Attachment Error",
        messages: [
          {
            id: '1',
            content: 'Hello! May I send files in this chat?',
            role: 'user',
          },
          {
            id: '2',
            content: "Hello, you can try, but you will get an error now.",
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const fileUploadMock = async () => {
    await new Promise((_resolve, reject) => setTimeout(reject, 500));
  };

  const onFileAttached = async ({ actions }: FileAttachedParams) => {
    const { setError } = actions;

    try {
      await fileUploadMock();
    } catch {
      setError('Server error');
    }
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        onFileAttached={onFileAttached}
      />
    </Box>
  );
}

export default FileAttachmentError;
