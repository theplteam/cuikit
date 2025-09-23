import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type BoxProps } from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { MessageModel, MessageStatus } from '../../models';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

type Props = {
  message: MessageModel;
  stopAnimation?: boolean;
} & BoxProps;

const palette = materialDesignSysPalette;

const keyframeName = 'chat-ui-analyze-await';

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

const MessageAssistantStatus: React.FC<Props> = ({ message }) => {
  const status = useObserverValue(message.status) as MessageStatus | string | undefined;

  return (
    <StatusBoxStyled>
      <Typography variant="body1">
        {status}
      </Typography>
    </StatusBoxStyled>
  );
};

export default MessageAssistantStatus;
