import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type BoxProps } from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { useChatSlots } from '../core/ChatSlotsContext';
import { StreamResponseState, ThreadModel } from '../../models';
import { useLocalizationContext } from '../core/LocalizationContext';
import Stack from '@mui/material/Stack';

type Props = {
  thread: ThreadModel | undefined;
} & BoxProps;

const palette = materialDesignSysPalette;

const keyframeName = 'pl-analyze-await';
export const StatusBoxStyled = styled(Stack)(() => ({
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
  color: palette.outline,
  animationDelay: '.5s',
  animationDuration: '4.5s',
  animationIterationCount: 'infinite',
  animationName: keyframeName,
  background: `${palette.outlineVariant} -webkit-gradient(linear,100% 0,0 0,from(${palette.outlineVariant}),color-stop(.5,${palette.onSurface}),to(${palette.outlineVariant}))`,
  // background: `${palette.outlineVariant} linear-gradient(90deg, ${palette.outlineVariant} 0%, ${palette.onSurface} 50%, ${palette.outlineVariant} 100%)`,
  backgroundClip: 'text',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '50% 200%',
  width: '100%',
  cursor: 'default',
  /*'&:hover': {
    textFillColor: palette.onSurface,
    animation: 'none',
    background: 'transparent',
  },*/
  fallbacks: [
    {
      background: `linear-gradient(90deg, ${palette.outlineVariant} 0%, ${palette.onSurface} 50%, ${palette.outlineVariant} 100%)`
    }
  ]
}));

const MessageAssistantProgress: React.FC<Props> = ({ thread }) => {
  const state = useObserverValue(thread?.streamStatus) as StreamResponseState | string | undefined;
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
    || state === StreamResponseState.REASONING
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
