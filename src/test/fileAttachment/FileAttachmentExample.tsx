import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { randomInt } from "../../../packages/chat-ui/src/utils/numberUtils/randomInt";
import { FileAttachmentParams } from "../../../packages/chat-ui/src/models/FileAttachmentParams";

const FileAttachmentExample: React.FC = () => {
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
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
              {
                id: '2',
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
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
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                id: '2',
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                id: '3',
                type: 'file',
                base64: 'filename=exampleLooooooooooooooooooooooooooooooong.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                id: '4',
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                id: '5',
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                id: '6',
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
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
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                id: '2',
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
              {
                id: '3',
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
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

  const onFileAttached = async ({ params }: FileAttachmentParams) => {
    let progress = 0;
    const { setProgress } = params;

    const uploadSimulation = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (progress < 100) {
          progress += randomInt(1, 10);
          setProgress(progress);
        } else {
          clearInterval(interval);
          resolve();
        };
      }, 300);
    });

    await uploadSimulation;
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        enableBranches
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        onFileAttached={onFileAttached}
      />
    </Box>
  );
}

export default FileAttachmentExample;
