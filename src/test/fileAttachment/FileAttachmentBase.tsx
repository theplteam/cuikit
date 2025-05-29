import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { exampleFile, exampleImg3, exampleImg2 } from "./exampleFiles";

const text = `
Both images feature anthropomorphic cats.

The first image shows a fluffy white cat with light blue eyes sitting amidst a bed of roses and other flowers, some in shades of purple and pink. To the right of the cat, there's a glass of what appears to be champagne or a similar sparkling beverage, and behind it, a bottle. The background is a vibrant pink and purple, with what looks like floating bubbles or orbs. The cat has a somewhat serious or inquisitive expression.

The second image depicts a fluffy gray cat dressed in a dark green jacket and a brown bow tie, holding a violin as if playing it. The cat has yellow eyes. It is seated at a wooden table next to a lit candle in a glass pitcher, a silver chalice-like object, and an open book. There's also a slice of lime on the table. The background is dark and moody, with a hint of smoke or mist rising from behind the candle.
`;

const FileAttachmentBase: React.FC = () => {
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
                file: exampleImg2,
              },
              {
                id: '2',
                type: 'image',
                file: exampleImg3,
              },
            ],
            role: "user",
          },
          {
            id: '2',
            parentId: '1',
            content: text,
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
                file: exampleFile,
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
