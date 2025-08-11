import * as React from "react";
import {
  ChatPage,
  MessageSentParams,
  Thread,
  useAssistantAnswerMock,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { BarChart } from '@mui/x-charts/BarChart';

type ChartProps = {
  series: string,
};

const Chart: React.FC<ChartProps> = ({ series }) => {
  const seriesParsed = JSON.parse(series);

  return (
    <BarChart
      xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
      series={seriesParsed}
      height={300}
    />
  )
};

const markdownString = `
Hello! Here is an example of a graph.

**Example**
<Chart series='[{ "data": ["4", "3", "5"] }, { "data": ["1", "6", "3"] }, { "data": ["2", "5", "6"] }]' />
`;

const App: React.FC = () => {
  const { streamGenerator } = useAssistantAnswerMock();
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
    const stream = streamGenerator(markdownString, { delay: 100 });

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }

    params.onFinish();
  }, []);

  const customMarkdownComponents = [{
    name: "Chart",
    component: Chart,
    skeletonHeight: 300,
  }];

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        initialThread={threads[0]}
        threads={threads}
        customMarkdownComponents={customMarkdownComponents}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
