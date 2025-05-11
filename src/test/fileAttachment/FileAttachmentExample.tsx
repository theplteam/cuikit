import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { randomInt } from "../../../packages/chat-ui/src/utils/numberUtils/randomInt";

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Base syntax",
        messages: [
          {
            content: [
              {
                type: 'text',
                text: "Img",
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
            ],
            role: "user",
          },
          {
            content: "Ans",
            role: "assistant",
          },
          {
            content: [
              {
                type: 'text',
                text: "File",
              },
              {
                type: 'file',
                base64: 'NDIyIC0gc25hY2tlYml0ZQ0KNzQgLSBjczIwDQoNCjYzYWRjNzgzOTY4ODVhZTA2ZWJiZTljYTMwZmY4NjQ4VHowNE1qa3dPQ3hGUFRFM016YzNPVE0wT0Rjd01EQXNVejF3Y21WdGFYVnRMRXhOUFhOMVluTmpjbWx3ZEdsdmJpeExWajB5'
              }
            ],
            role: "user",
          },
          {
            content: "Ans",
            role: "assistant",
          },
          {
            content: [
              {
                type: 'text',
                text: "File + Img",
              },
              {
                type: 'file',
                base64: 'NDIyIC0gc25hY2tlYml0ZQ0KNzQgLSBjczIwDQoNCjYzYWRjNzgzOTY4ODVhZTA2ZWJiZTljYTMwZmY4NjQ4VHowNE1qa3dPQ3hGUFRFM016YzNPVE0wT0Rjd01EQXNVejF3Y21WdGFYVnRMRXhOUFhOMVluTmpjbWx3ZEdsdmJpeExWajB5'
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
            ],
            role: "user",
          },
          {
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

  const onFileAttached = async ({ file, params }: { file: File | Blob, params: { setProgress: (num: number) => void, onFinish: () => void } }) => {
    console.log('file', file);
    let progress = 0;
    const { setProgress, onFinish } = params;

    const uploadSimulation = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (progress < 100) {
          progress += randomInt(1, 10);
          setProgress(progress);
        } else {
          clearInterval(interval);
          resolve();
          onFinish()
        };
      }, 300);
    });

    await uploadSimulation;
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        onFileAttached={onFileAttached}
      />
    </Box>
  );
}

export default App;
