import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  FileAttachedParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const FileAttachmentProgress: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Attachment Progress",
        messages: [
          {
            id: '1',
            content: 'Hello! May I send files in this chat?',
            role: "user",
          },
          {
            id: '2',
            content: "Hello, yes, you can send files in this chat, and you can also monitor the process of uploading them to the server.",
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const fileUploadMock = async (callback: (num: number) => void) => {
    for (let i = 0; i < 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      callback(i);
    }
  };

  const onFileAttached = async ({ actions }: FileAttachedParams) => {
    const { setProgress } = actions;

    await fileUploadMock(setProgress);
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

export default FileAttachmentProgress;
