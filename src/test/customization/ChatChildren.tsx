import * as React from "react";
import {
  useAssistantAnswerMock,
  Thread,
  Chat,
  useChatContext,
} from "@plteam/chat-ui";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar } from "@mui/material";

const date = (new Date()).toISOString();

const threads: Thread[] = [
  {
    id: "1",
    title: "Traveling to Japan",
    date: date,
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
  },
];

const StackStyled = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  backgroundColor: theme.palette.background.paper,
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  padding: theme.spacing(2),
}));

type InfoModalProps = {
  open: boolean,
  onClose: () => void,
};

const ParamsRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <Stack flexDirection='row' gap={1}>
    <Typography fontWeight={600}>
      {label + ':'}
    </Typography>
    <Typography>
      {value}
    </Typography>
  </Stack>
);

const InfoModal: React.FC<InfoModalProps> = ({ open, onClose }) => {
  const { model } = useChatContext();
  const thread = model.currentThread.value;

  return (
    <Modal open={open} onClose={onClose}>
      <StackStyled gap={1}>
        <ParamsRow label="Thread title" value={`${thread?.title}`} />
        <ParamsRow label="Thread id" value={`${thread?.id}`} />
        <ParamsRow label="Total number of messages" value={`${thread?.messages.length}`} />
      </StackStyled>
    </Modal>
  );
};

const ChildrenComponent = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const { apiRef, model } = useChatContext();

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleClearChat = () => {
    const currentThread = model.currentThread.value;
    if (currentThread) model.delete(currentThread.id);

    const newThread = apiRef.current?.handleCreateNewThread?.();
    if (newThread) apiRef.current?.openNewThread(newThread);
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton color='inherit' onClick={handleModalOpen}>
            <InfoIcon />
          </IconButton>
          <IconButton color='inherit' onClick={handleClearChat}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <InfoModal open={modalOpen} onClose={handleModalClose} />
    </>
  );
};

const App: React.FC = () => {
  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box
      height="100dvh"
      width="100dvw"
    >
      <Box
        width="100%"
        height='calc(100vh - 64px)'
        overflow="auto"
        paddingTop={8}
      >
        <Chat
          initialThread={threads[0]}
          threads={threads}
          handleStopMessageStreaming={handleStopMessageStreaming}
          onUserMessageSent={onUserMessageSent}
        >
          <ChildrenComponent />
        </Chat>
      </Box>
    </Box>
  );
};

export default App;
