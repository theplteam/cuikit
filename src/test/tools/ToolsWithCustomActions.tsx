import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
  ChatFormActionsProps,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { toolsList } from "./toolsList";
import { BulbIcon, InternetIcon } from "./icons";

const assistantAnswer = `
Everything to the right of the tools button is rendered by the \`formActions\` slot.
`;

const FormActions: React.FC<ChatFormActionsProps> = ({ isTyping, thread }) => (
  <Stack direction="row" gap={1} alignItems="center">
    <Tooltip title="My custom action">
      <span>
        <IconButton disabled={isTyping || !thread} size="small">
          <BulbIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
    <Chip
      icon={<InternetIcon fontSize="small" />}
      label="Custom chip"
      size="small"
      disabled={isTyping}
    />
  </Stack>
);

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Tools with custom actions",
        messages: [
          {
            id: '1',
            content: 'What can I put next to the tools button?',
            role: "user",
          },
          {
            id: '2',
            parentId: '1',
            content: assistantAnswer,
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
        slots={{ formActions: FormActions }}
        threads={threads}
        toolsList={toolsList}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
