import * as React from "react";
import {
  ChatPage,
  MessageSentParams,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Chart from "./components/Chart";

const markdownString = `
Hello! Here is an example of a graph.

**Example**
<Chart data='[{"name": "Bar 1", "value": 100}, {"name": "Bar 2", "value": 200}, {"name": "Bar 3", "value": 300}, {"name": "Bar 4", "value": 400}, {"name": "Bar 5", "value": 500}]' />
`;

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Markdown custom components",
        messages: [
          {
            content: "Hi, can you make an example graph?",
            role: "user",
          },
          {
            content: markdownString,
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    const split = markdownString.split(' ');

    for await (const chunk of split) {
      await new Promise((resolve) => setTimeout(() => {
        params.pushChunk(chunk + ' ');
        resolve(true)
      }, 200))
    }

    params.onFinish();
  }, []);

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        initialThread={threads[0]}
        threads={threads}
        slotProps={{
          markdownH1: {
            variant: "h4",
            color: "primary",
          },
          markdownH2: {
            variant: "h5",
            color: "primary",
          },
          markdownH3: {
            variant: "h6",
            color: "primary",
          },
        }}
        customMarkdownComponents={[Chart]}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
