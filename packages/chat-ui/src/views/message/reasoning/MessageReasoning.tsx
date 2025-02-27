import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { MessageModel } from '../../../models/MessageModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import MessageReasoningFull from './MessageReasoningFull';
import MessageReasoningShort from './MessageReasoningShort';

type Props = {
  message: MessageModel;
};

const LineBoxStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 4,
  minWidth: 4,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 999,
  transition: theme.transitions.create('opacity', { duration: '.5s' }),
}));

const MessageReasoning: React.FC<Props> = ({ message }) => {
  const [expanded, setExpanded] = React.useState(false);

  const reasoning = useObserverValue(message.reasoning) ?? '';

  const handleExpandBlock = () => {
    setExpanded(true);
  }

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <LineBoxStyled sx={{ opacity: reasoning ? 1 : 0 }} />
      {expanded
        ? <MessageReasoningFull text={reasoning} />
        : (
          <Box onClick={handleExpandBlock}>
            <MessageReasoningShort reasoning={reasoning} />
          </Box>
        )}
    </Stack>
  );
}

export default MessageReasoning;
