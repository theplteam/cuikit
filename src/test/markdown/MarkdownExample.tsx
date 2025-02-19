import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  DDialogue,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const markdownString = `
# Heading level 1
            
## Heading level 2

### Heading level 3

#### Heading level 4

##### Heading level 5

###### Heading level 6

**Bold**

*Italic*

Ordered Lists:

1. First item
2. Second item
3. Third item

Unordered Lists:

- First item
- Second item
- Third item

Example of a code block:

\`\`\`jsx
import React from 'react';

const App = () => {
  return <div>Hello, world!</div>
};

export default App;
\`\`\`

Quote:

> Line 1
> Line 2
> Line 3

Example of a table:

| Name  | Age | City          |
|-------|-----|---------------|
| Alice | 30  | New York      |
| Bob   | 25  | London        |
| Carol | 35  | San Francisco |
`;

const App: React.FC = () => {
  const [dialogues] = React.useState<DDialogue[]>(
    [
      {
        id: "1",
        title: "Base syntax",
        messages: [
          {
            content: "Hello! Show me how you render markdown",
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

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height={"100dvh"} width={"100dvw"}>
      <ChatPage
        dialogue={dialogues[0]}
        dialogues={dialogues}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
