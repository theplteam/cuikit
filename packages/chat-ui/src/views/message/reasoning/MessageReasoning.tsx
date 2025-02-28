import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MessageReasoningFull from './MessageReasoningFull';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MessageModel, StreamResponseState, ThreadModel } from '../../../models';
import { Collapse, Fade } from '@mui/material';
import { useThreadContext } from '../../thread/ThreadContext';
import { useReasoningParse } from './useReasoningParse';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { StatusBoxStyled } from '../MessageAssistantProgress';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReasoningTextSmooth from './ReasoningTextSmooth';

type Props = {
  thread: ThreadModel;
  message: MessageModel;
};

const arrowClassName = 'chat-ui-message-reasoning-arrow';

const LineBoxStyled = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 4,
  minWidth: 4,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 999,
  transition: theme.transitions.create('opacity', { duration: '.5s' }),
}));

const TitleStackStyled = styled(StatusBoxStyled)(({ theme }) => ({
  cursor: 'pointer',

  [`& .${arrowClassName}`]: {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    fontSize: '0.75rem',
  }
}));

enum ViewType {
  SHORT, FULL
}

const transitionDuration = 200;

const MessageReasoning: React.FC<Props> = ({ thread, message }) => {
  const [isExpanding, setIsExpanding] = React.useState(false);
  const [viewType, setViewType] = React.useState<ViewType>(ViewType.SHORT);
  const [fullCollapseSize, setFullCollapseSize] = React.useState(0);

  const state = useObserverValue(thread?.streamStatus) as StreamResponseState | string | undefined;
  const shortRef = React.useRef<HTMLDivElement | null>(null);

  const reasoning = useObserverValue(message.reasoning) ?? '';
  const { apiRef } = useThreadContext()
  const { slots, slotProps } = useChatSlots()

  const { title, description } = useReasoningParse(reasoning);

  React.useEffect(() => {
    if (title) {
      apiRef.current?.setProgressStatus(title);
    }
  }, [title]);

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
    // setTimeout(() => setViewType(newValue ? ViewType.FULL : ViewType.SHORT),transitionDuration);
  }

  React.useEffect(() => {
    if (title) {
      if (apiRef.current?.getProgressStatus() !== StreamResponseState.REASONING) {
        apiRef.current?.setProgressStatus(StreamResponseState.REASONING);
      }
    }
  }, [title]);

  if (state === StreamResponseState.TYPING_MESSAGE || state === StreamResponseState.FINISH_MESSAGE) return null;

  const isFull = viewType === ViewType.FULL;
  const isShort = viewType === ViewType.SHORT;

  return (
    <Stack gap={1.5}>
      {!!title && (
        <TitleStackStyled
          direction="row"
          gap={1}
          alignItems="center"
          onClick={handleExpandedChange}
        >
          <slots.messageAssistantProgressText
            variant="body1"
            {...slotProps.messageAssistantProgressText}
          >
            {title}
          </slots.messageAssistantProgressText>
          <ArrowForwardIosIcon
            className={arrowClassName}
            style={{
              transform: isExpanding ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </TitleStackStyled>
      )}
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
