import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box, { type BoxProps } from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { useChatSlots } from '../core/ChatSlotsContext';
import { Dialogue, StreamResponseState } from '../../models';

type Props = {
  dialogue: Dialogue;
} & BoxProps;

const palette = materialDesignSysPalette;

const keyframeName = 'pl-analyze-await';
const BoxStyled = styled(Box)(() => ({
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


const steps: Record<string, string[]> = {
  [StreamResponseState.START]: ['Думаю', 'Thinking'],
};

const MessageAssistantProgress: React.FC<Props> = ({ dialogue }) => {
  const state = useObserverValue(dialogue.streamState) as StreamResponseState | string | undefined;
  const { slots, slotProps } = useChatSlots();
  const text = (state && steps[state]) ?? state;

  if (!text || state === StreamResponseState.TYPING_MESSAGE || state === StreamResponseState.FINISH_MESSAGE) return null;

  return (
    <BoxStyled>
      <slots.messageAssistantProgressText
        variant="body2"
        {...slotProps.messageAssistantProgressText}
      >
        {text}
      </slots.messageAssistantProgressText>
    </BoxStyled>
  );
};

export default MessageAssistantProgress;
