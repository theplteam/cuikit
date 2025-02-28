import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MessageReasoningFull from './MessageReasoningFull';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MessageModel, ThreadModel } from '../../../models';
import { Collapse, Fade } from '@mui/material';
import { useReasoningParse } from './useReasoningParse';
import ReasoningTextSmooth from './ReasoningTextSmooth';
import MessageReasoningTitle from './MessageReasoningTitle';
import { useThreadContext } from '../../thread/ThreadContext';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
};

const LineBoxStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 4,
  minWidth: 4,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 999,
  transition: theme.transitions.create('opacity', { duration: '.5s' }),
}));

enum ViewType {
  SHORT, FULL
}

const transitionDuration = 200;

const MessageReasoning: React.FC<Props> = ({ message, thread }) => {
  const [isExpanding, setIsExpanding] = React.useState(false);
  const [viewType, setViewType] = React.useState<ViewType>(ViewType.SHORT);
  const [fullCollapseSize, setFullCollapseSize] = React.useState(0);

  const { apiRef } = useThreadContext();

  const shortRef = React.useRef<HTMLDivElement | null>(null);

  const reasoning = useObserverValue(message.reasoning) ?? '';

  const description = useReasoningParse(reasoning, message);

  const handleExpandedChange = () => {
    if (!isExpanding) {
      setFullCollapseSize(shortRef.current?.clientHeight ?? 0);
    }

    const newValue = !isExpanding;
    setIsExpanding(newValue);

    if (newValue) {
      setViewType(ViewType.FULL);
    } else {
      setTimeout(() => setViewType(ViewType.SHORT),transitionDuration);
    }
    setTimeout(
      () => apiRef.current?.updateScrollButtonState(),
      transitionDuration,
    );

    // setTimeout(() => setViewType(newValue ? ViewType.FULL : ViewType.SHORT),transitionDuration);
  }

  const isFull = viewType === ViewType.FULL;
  const isShort = viewType === ViewType.SHORT;

  return (
    <Stack gap={1.5}>
      <MessageReasoningTitle
        message={message}
        thread={thread}
        isExpanding={isExpanding}
        handleExpandedChange={handleExpandedChange}
      />
      <Stack
        direction="row"
        alignItems="center"
        onClick={handleExpandedChange}
      >
        <LineBoxStyled sx={{ opacity: reasoning ? 1 : 0 }} />
        <Collapse in={isExpanding} timeout={transitionDuration} collapsedSize={fullCollapseSize}>
          <Fade in={isExpanding} timeout={transitionDuration}>
            <Box display={isFull ? undefined : 'none'} ml={2}>
              <MessageReasoningFull text={reasoning} />
            </Box>
          </Fade>
        </Collapse>
        <Fade in={isShort} timeout={transitionDuration}>
          <Box
          // Animation replays after switching from display: none
          // https://www.w3.org/TR/css-animations-1/#animations
          // If an element has a display of none, updating display to a value other than none will start all animations applied to the element by the animation-name property,
          // as well as all animations applied to descendants with display other than none.
            ref={shortRef}
            height={isFull ? 0 : 'auto'}
            overflow="hidden"
            width={isFull ? 0 : undefined}
            visibility={isFull ? 'hidden' : 'visible'}
            ml={2}
          >
            <ReasoningTextSmooth text={description} />
          </Box>
        </Fade>
      </Stack>
    </Stack>

  );
}

export default MessageReasoning;
