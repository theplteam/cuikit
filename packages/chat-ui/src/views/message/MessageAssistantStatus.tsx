import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type BoxProps } from '@mui/material/Box';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import { MessageModel } from '../../models';
import { useLocalizationContext } from '../core/LocalizationContext';
import Stack from '@mui/material/Stack';

type Props = {
  message: MessageModel;
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

const MessageAssistantStatus: React.FC<Props> = ({ message }) => {
  const status = useObserverValue(message.status);
  const typing = useObserverValue(message.typing);
  const { slots, slotProps } = useChatSlots();
  const locale = useLocalizationContext();

  // `undefined` while typing → default "thinking" indicator; `''` or idle → nothing.
  const text = status === undefined ? (typing ? locale.thinking : undefined) : status;

  if (!text) return null;

  return (
    <StatusBoxStyled>
      <slots.messageAssistantStatusText
        variant="body1"
        {...slotProps.messageAssistantStatusText}
      >
        {text}
      </slots.messageAssistantStatusText>
    </StatusBoxStyled>
  );
};

export default MessageAssistantStatus;
