import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MessageReasoningFull from './MessageReasoningFull';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MessageModel } from '../../../models';
import { Collapse, Fade } from '@mui/material';
import { useReasoningParse } from './useReasoningParse';
import ReasoningTextSmooth from './ReasoningTextSmooth';
import MessageReasoningTitle from './MessageReasoningTitle';
import { useThreadContext } from '../../thread/ThreadContext';
import SimpleScrollbar from '../../../ui/SimpleScrollbar';
import { ReasoningViewType } from '../../../models/MessageReasoningModel';
import { chatClassNames } from '../../core/chatClassNames';

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

enum ViewType {
  SHORT, FULL
}

const transitionDuration = 200;

const MessageReasoning: React.FC<Props> = ({ message }) => {
  const [viewType, setViewType] = React.useState<ViewType>(ViewType.SHORT);
  const [fullCollapseSize, setFullCollapseSize] = React.useState(0);

  const { apiRef } = useThreadContext();

  const shortRef = React.useRef<HTMLDivElement | null>(null);

  const typing = useObserverValue(message.typing);
  const reasoning = useObserverValue(message.reasoningManager.text) ?? '';

  const inProgress = !!typing && !!reasoning;

  const [isExpanding, setIsExpanding] = React.useState(false);
  const { reasoningType, description } = useReasoningParse(reasoning, message, inProgress);

  const handleExpandedChange = () => {
    if (!isExpanding) {
      setFullCollapseSize(shortRef.current?.clientHeight ?? 0);
    }

    const newValue = !isExpanding;
    setIsExpanding(newValue);

    if (newValue) {
      setViewType(ViewType.FULL);
    } else {
      setTimeout(() => setViewType(ViewType.SHORT), transitionDuration);
    }
    setTimeout(
      () => apiRef.current?.updateScrollButtonState(),
      transitionDuration,
    );

    // setTimeout(() => setViewType(newValue ? ViewType.FULL : ViewType.SHORT),transitionDuration);
  }

  const isFull = viewType === ViewType.FULL;
  const isShort = viewType === ViewType.SHORT;

  if (!reasoning) return null;

  return (
    <Stack gap={1.5} className={chatClassNames.messageReasoningRoot}>
      <MessageReasoningTitle
        message={message}
        inProgress={inProgress}
        isExpanding={isExpanding}
        handleExpandedChange={handleExpandedChange}
      />
      <Stack
        direction="row"
        alignItems="center"
      >
        <LineBoxStyled sx={{ opacity: reasoning ? 1 : 0 }} />
        {(reasoningType === ReasoningViewType.STREAM || reasoningType === ReasoningViewType.HEADERS_STREAM) && (
          <Collapse in={isExpanding} timeout={transitionDuration} sx={{ flex: 1 }}>
            <Box
              ml={2}
              flex={1}
            >
              <SimpleScrollbar style={{ maxHeight: 300 }}>
                <MessageReasoningFull messageId={message.id} text={reasoning} isProgress={inProgress} />
              </SimpleScrollbar>
            </Box>
          </Collapse>
        )}
        {reasoningType === ReasoningViewType.SHORT_BLOCKS && (
          <>
            <Collapse in={isExpanding} timeout={transitionDuration} collapsedSize={fullCollapseSize}>
              <Fade in={isExpanding} timeout={transitionDuration}>
                <Box display={isFull ? undefined : 'none'} ml={2}>
                  <MessageReasoningFull messageId={message.id} text={reasoning} isProgress={inProgress} />
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
                onClick={handleExpandedChange}
              >
                <ReasoningTextSmooth text={description} />
              </Box>
            </Fade>
          </>
        )}
      </Stack>
    </Stack>

  );
}

export default React.memo(MessageReasoning, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id;
});;
