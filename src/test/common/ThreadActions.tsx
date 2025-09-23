import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread,
  useChatApiRef,
  useHistoryContext,
  ChatPage,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SvgIcon from "@mui/material/SvgIcon";

type ActionProps = {
  thread: Thread;
  onClose: () => void;
};

type ItemMenuProps = {
  label: string;
  onClick: () => void;
  Icon: typeof SvgIcon
};

const ItemMenu: React.FC<ItemMenuProps> = ({ label, Icon, onClick }) => (
  <MenuItem onClick={onClick}>
    <ListItemIcon>
      <Icon fontSize="small" />
    </ListItemIcon>
    <ListItemText>
      {label}
    </ListItemText>
  </MenuItem>
);

const ShareAction = ({ thread, onClose }: ActionProps) => {
  const handleClick = () => {
    console.log(thread);
    // share logic
    onClose();
  };

  return <ItemMenu Icon={ShareIcon} label="Share" onClick={handleClick} />;
};

const DeleteAction = ({ thread, onClose }: ActionProps) => {
  const { apiRef } = useHistoryContext();

  const handleClick = () => {
    apiRef.current?.setDeleteItem?.(thread);
    onClose();
  };

  return <ItemMenu Icon={DeleteIcon} label="Delete" onClick={handleClick} />;
};

const App: React.FC = () => {
  const threads = [{
    id: "1",
    title: "History",
    messages: [
      {
        id: "1",
        content: "Hi! Do you know anything about traveling to Japan?",
        role: "user",
      },
      {
        id: "2",
        content: "Hi! Yes, I know a bit. What specifically do you want to know? Transportation, culture, or something else?",
        role: "assistant",
      },
      {
        id: "3",
        content: "I'm curious about transportation. How does the train system work?",
        role: "user",
      },
      {
        id: "4",
        content: "Japan has an excellent train system. There are high-speed trains called Shinkansen connecting major cities, and regional lines are great for shorter trips.",
        role: "assistant",
      },
    ],
    date: "2024-11-16 08:07:54"
  }];
  const chatApiRef = useChatApiRef();

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const threadActions = React.useMemo(() => [ShareAction, DeleteAction], []);

  return (
    <Box
      width="100%"
      height='100%'
      overflow="auto"
    >
      <ChatPage
        apiRef={chatApiRef}
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        historyProps={{
          threadActions: threadActions,
        }}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
