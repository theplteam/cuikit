import * as React from 'react';
import { ArrowForwardIosIcon } from '../../../icons';
import { useObserverValue } from '../../hooks/useObserverValue';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { MessageModel } from '../../../models';
import { styled } from '@mui/material/styles';
import { StatusBoxStyled } from '../MessageAssistantStatus';
import { FnType } from '../../../models/types';
import { useReasoningTimeText } from './useReasoningTimeText';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  message: MessageModel;
  isExpanding: boolean;
  handleExpandedChange: FnType;
  inProgress: boolean;
};

const arrowClassName = 'chat-ui-message-reasoning-arrow';

const TitleStackStyled = styled(StatusBoxStyled)(({ theme }) => ({
  cursor: 'pointer',

  [`& .${arrowClassName}`]: {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    fontSize: '0.75rem',
  }
}));

const MessageReasoningTitle: React.FC<Props> = ({ message, isExpanding, handleExpandedChange, inProgress }) => {
  const locale = useLocalizationContext();
  const reasoningTitle = useObserverValue(message.reasoningManager.title) || locale.thinking;

  const reasoningEnded = !inProgress;

  useReasoningTimeText(message);

  const { slots, slotProps } = useChatSlots();

  return (
    <TitleStackStyled
      direction="row"
      gap={1}
      alignItems="center"
      sx={reasoningEnded
        ? {
          animation: 'none',
          background: 'none',
          color: 'inherit',
          textFillColor: 'currentcolor',
        } : {}}
      onClick={handleExpandedChange}
    >
      <slots.messageAssistantReasoningTitle
        variant="body1"
        {...slotProps.messageAssistantReasoningTitle}
      >
        {reasoningTitle}
      </slots.messageAssistantReasoningTitle>
      <ArrowForwardIosIcon
        className={arrowClassName}
        style={{
          transform: isExpanding ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      />
    </TitleStackStyled>
  );
}

export default React.memo(MessageReasoningTitle, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id
    && prevProps.isExpanding === nextProps.isExpanding
    && prevProps.inProgress === nextProps.inProgress;
});
