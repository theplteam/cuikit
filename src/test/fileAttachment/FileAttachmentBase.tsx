import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { exampleFile, exampleImg } from "./exampleFiles";

const FileAttachmentBase: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Base syntax",
        messages: [
          {
            id: '1',
            content: [
              {
                type: 'text',
                text: "Img",
              },
              {
                id: '1',
                type: 'image',
                file: exampleImg,
              },
              {
                id: '2',
                type: 'image',
                file: exampleImg,
              },
            ],
            role: "user",
          },
          {
            id: '2',
            parentId: '1',
            content: "Ans",
            role: "assistant",
          },
          {
            id: '3',
            parentId: '2',
            content: [
              {
                type: 'text',
                text: "File",
              },
              {
                id: '1',
                type: 'file',
                file: exampleFile,
              },
              {
                id: '2',
                type: 'file',
                file: exampleFile,
              },
              {
                id: '3',
                type: 'file',
                file: exampleFile,
              },
              {
                id: '4',
                type: 'file',
                file: exampleFile,
              },
              {
                id: '5',
                type: 'file',
                file: exampleFile,
              },
              {
                id: '6',
                type: 'file',
                file: exampleFile,
              },
            ],
            role: "user",
          },
          {
            id: '4',
            parentId: '3',
            content: "Ans",
            role: "assistant",
          },
          {
            id: '5',
            parentId: '4',
            content: [
              {
                type: 'text',
                text: "File + Img",
              },
              {
                id: '1',
                type: 'file',
                file: exampleFile,
              },
              {
                id: '2',
                type: 'image',
                file: exampleImg,
              },
              {
                id: '3',
                type: 'image',
                file: exampleImg,
              },
            ],
            role: "user",
          },
          {
            id: '6',
            parentId: '5',
            content: "Ans",
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
        enableBranches
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        acceptableFileFormat={['image']}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default FileAttachmentBase;
