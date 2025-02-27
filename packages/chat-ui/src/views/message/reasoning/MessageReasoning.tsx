import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { MessageModel } from '../../../models/MessageModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import MessageReasoningFull from './MessageReasoningFull';
import { useReasoningParse } from './useReasoningParse';
import { useThreadContext } from '../../thread/ThreadContext';
import ReasoningTextSmooth from './ReasoningTextSmooth';

type Props = {
  message: MessageModel;
};

const LineBoxStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 4,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 999,
}));

const MessageReasoning: React.FC<Props> = ({ message }) => {
  const [expanded, setExpanded] = React.useState(false);

  const reasoning = useObserverValue(message.reasoning) ?? '';

  const { apiRef } = useThreadContext()

  const { title, description } = useReasoningParse(reasoning);

  const handleExpandBlock = () => {
    setExpanded(true);
  }

  React.useEffect(() => {
    if (title) {
      apiRef.current?.setProgressStatus(title);
    }
  }, [title]);

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <LineBoxStyled />
      {expanded
        ? <MessageReasoningFull text={reasoning} />
        : (
          <Box onClick={handleExpandBlock}>
            <ReasoningTextSmooth text={description} />
          </Box>
        )}
    </Stack>
  );
}

export default MessageReasoning;
