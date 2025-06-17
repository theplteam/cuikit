import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  FileAttachedParams,
} from "@plteam/chat-ui";
import { SnackbarProvider, useSnackbar } from 'notistack';
import Box from "@mui/material/Box";

const describeImgText = `
Both images feature anthropomorphic cats.

The first image shows a fluffy white cat with light blue eyes sitting amidst a bed of roses and other flowers, some in shades of purple and pink. To the right of the cat, there's a glass of what appears to be champagne or a similar sparkling beverage, and behind it, a bottle. The background is a vibrant pink and purple, with what looks like floating bubbles or orbs. The cat has a somewhat serious or inquisitive expression.

The second image depicts a fluffy gray cat dressed in a dark green jacket and a brown bow tie, holding a violin as if playing it. The cat has yellow eyes. It is seated at a wooden table next to a lit candle in a glass pitcher, a silver chalice-like object, and an open book. There's also a slice of lime on the table. The background is dark and moody, with a hint of smoke or mist rising from behind the candle.
`;

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Attachment",
        messages: [
          {
            id: '1',
            content: [
              {
                type: 'text',
                text: "Describe what you see in the images",
              },
              {
                id: '1',
                type: 'image',
                url: 'https://examples.cuikit.com/files/exampleImage1.jpg',
              },
              {
                id: '2',
                type: 'image',
                url: 'https://examples.cuikit.com/files/exampleImage2.jpg',
              },
            ],
            role: "user",
          },
          {
            id: '2',
            parentId: '1',
            content: describeImgText,
            role: "assistant",
          },
          {
            id: '3',
            parentId: '2',
            content: [
              {
                type: 'text',
                text: "What does this file contain?",
              },
              {
                id: '1',
                type: 'file',
                url: 'https://examples.cuikit.com/files/exampleText.txt',
              },
            ],
            role: "user",
          },
          {
            id: '4',
            parentId: '3',
            content: `The file contains the text "Hello world".`,
            role: "assistant",
          },
          {
            id: '5',
            parentId: '4',
            content: [
              {
                type: 'text',
                text: "Briefly describe the contents of the video file.",
              },
              {
                id: '1',
                type: 'video',
                url: 'https://examples.cuikit.com/files/exampleVideo.mp4',
              },
            ],
            role: "user",
          },
          {
            id: '6',
            parentId: '5',
            content: `In this video, I recognized a girl who is programming a robot.`,
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

  const fileUploadMock = async (callback: (num: number) => void) => {
    for (let i = 0; i < 100; i += Math.floor(Math.random() * (10 - 1 + 1)) + 1) {
      await new Promise(resolve => setTimeout(resolve, 2));
      callback(i);
    }
  };

  const onFileAttached = async ({ file, actions }: FileAttachedParams) => {
    const { setProgress, setError } = actions;
    // setError('test error');
    // return;
    try {
      await fileUploadMock(setProgress);
      enqueueSnackbar(`File ${file.name} uploaded`);
    } catch {
      setError('Server error');
    }
  };

  const onFileDetached = () => {
    enqueueSnackbar('File deleted');
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        enableBranches
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        maxFileSizeBytes={5 * 1024 * 1024}
        maxFileCount={15}
        onUserMessageSent={onUserMessageSent}
        onFileAttached={onFileAttached}
        onFileDetached={onFileDetached}
      />
    </Box>
  );
}

const FileAttachmentBase: React.FC = () => (
  <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>
);

export default FileAttachmentBase;
