import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type BoxProps } from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import { MessageModel, StreamResponseState, ThreadModel } from '../../models';
import { useLocalizationContext } from '../core/LocalizationContext';
import Stack from '@mui/material/Stack';

type Props = {
  thread: ThreadModel;
  message: MessageModel;
  stopAnimation?: boolean;
} & BoxProps;

const keyframeName = 'chat-ui-analyze-await';

export const StatusBoxStyled = styled(Stack)(({ theme }) => ({
  [`@keyframes ${keyframeName}`]: {
    from: {
      backgroundPosition: '-100% top'
    },
    to: {
      backgroundPosition: '250% top'
    }
  },
  textFillColor: 'transparent',
  backgroundPosition: '-100% top',
  color: theme.palette.text.secondary,
  animationDelay: '.5s',
  animationDuration: '4.5s',
  animationIterationCount: 'infinite',
  animationName: keyframeName,
  background: `${theme.palette.text.secondary} -webkit-gradient(linear,100% 0,0 0,from(${theme.palette.text.secondary}),color-stop(.5,${theme.palette.text.primary}),to(${theme.palette.text.secondary}))`,
  backgroundClip: 'text',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '50% 200%',
  width: '100%',
  cursor: 'default',
  fallbacks: [
    {
      background: `linear-gradient(90deg, ${theme.palette.text.secondary} 0%, ${theme.palette.text.primary} 50%, ${theme.palette.text.secondary} 100%)`
    }
  ]
}));

const MessageAssistantProgress: React.FC<Props> = ({ thread, message }) => {
  const state = useObserverValue(thread.streamStatus) as StreamResponseState | string | undefined;
  const reasoningTitle = useObserverValue(message.reasoningManager.text) ?? '';
  const reasoningTime = useObserverValue(message.reasoningManager.timeSec) ?? '';
  const { slots, slotProps } = useChatSlots();
  const locale = useLocalizationContext();
  let text = state;

  if (state === StreamResponseState.START) {
    text = locale.thinking;
  }

  if (
    !text
    || state === StreamResponseState.TYPING_MESSAGE
    || state === StreamResponseState.FINISH_MESSAGE
    || !!reasoningTitle
    || !!reasoningTime
  ) return null;

  return (
    <StatusBoxStyled>
      <slots.messageAssistantProgressText
        variant="body1"
        {...slotProps.messageAssistantProgressText}
      >
        {text}
      </slots.messageAssistantProgressText>
    </StatusBoxStyled>
  );
};

export default MessageAssistantProgress;
