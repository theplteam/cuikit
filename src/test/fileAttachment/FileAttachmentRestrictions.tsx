import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const FileAttachmentRestrictions: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Attachment Restriction",
        messages: [
          {
            id: '1',
            content: 'What are the restrictions on sending files to this chat?',
            role: "user",
          },
          {
            id: '2',
            content: `The following restrictions apply in this chat:
- Maximum number of files in one message: 3

- The size of a single file cannot exceed 10 MB

- Allowed file types: \`.png\`, \`.jpg\``,
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        acceptableFileFormat={['.png', '.jpg']}
        maxFileCount={3}
        maxFileSizeBytes={10 * 1024 * 1024}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default FileAttachmentRestrictions;
