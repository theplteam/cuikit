import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  MessageSentParams,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";

const RadioStyled = styled(Radio)(({ theme }) => ({
  color: `${theme.palette.common.white} !important`,
}));

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Welcome message",
      messages: [
        {
          id: '1',
          role: "user",
          content: "Hello!",
        },
        {
          id: '2',
          role: "assistant",
          content: "Hello there! How can I assist you today?",
          parentId: '1',
        },
      ],
    },
  ]);
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  const { reasoningGenerator, streamGenerator } = useAssistantAnswerMock()

  const onUserMessageSent = async ({ reasoning, ...params }: MessageSentParams) => {
    const reasoningStream = reasoningGenerator({ loremIpsumSize: 'large' });

    for await (const reasoningChunk of reasoningStream) {
      reasoning.pushChunk(reasoningChunk);
    }

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }
  };

  return (
    <Box height="100dvh" width="100dvw">
      <AppBar
        sx={{
          padding: (theme) => theme.spacing(1.5, 3),
          height: 64,
          backgroundColor: mode === 'dark' ? '#1b1d1c' : undefined
        }}
      >
        <RadioGroup
          row
          value={mode}
          onChange={(event) => setMode(event.target.value as 'light' | 'dark')}
        >
          <FormControlLabel
            value="light"
            control={<RadioStyled />}
            label="Light"
          />
          <FormControlLabel
            value="dark"
            control={<RadioStyled />}
            label="Dark"
          />
        </RadioGroup>
      </AppBar>
      <Box height="calc(100vh - 64px)" pt={8}>
        <ChatPage
          enableReasoning
          enableFileAttachments
          enableBranches
          initialThread={threads[0]}
          threads={threads}
          themeProps={{
            mode: mode,
          }}
          onUserMessageSent={onUserMessageSent}
        />
      </Box>
    </Box>
  );
};

export default App;
