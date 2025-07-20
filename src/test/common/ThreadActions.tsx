import * as React from "react";
import threadsJson from '../testThreads.json';
import {
  History,
  Chat,
  useAssistantAnswerMock,
  Thread,
  useChatApiRef,
  useHistoryContext,
} from "@plteam/chat-ui";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

type ActionProps = {
  thread: Thread;
  onClose: () => void;
}

const ShareAction = ({ thread, onClose }: ActionProps) => {
  const handleClick = () => {
    console.log(thread);
    // share logic
    onClose();
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <ShareIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        {"Share"}
      </ListItemText>
    </MenuItem>
  );
};

const DeleteAction = ({ thread, onClose }: ActionProps) => {
  const { apiRef } = useHistoryContext();

  const handleClick = () => {
    apiRef.current?.setDeleteItem?.(thread);
    onClose();
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        {"Delete"}
      </ListItemText>
    </MenuItem>
  );
};

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsJson);
  const chatApiRef = useChatApiRef();

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const threadActions = [ShareAction, DeleteAction];

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      height="100dvh"
      width="100dvw"
    >
      <History apiRef={chatApiRef} threadActions={threadActions} />
      <Box
        width="100%"
        height='100%'
        overflow="auto"
      >
        <Chat
          apiRef={chatApiRef}
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          onUserMessageSent={onUserMessageSent}
        />
      </Box>
    </Stack>
  );
}

export default App;
