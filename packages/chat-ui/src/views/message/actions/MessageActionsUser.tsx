import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { EditIcon } from '../../../icons';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  className: string;
  onClickEdit: () => void;
  disabled?: boolean;
};

const RootStyled = styled(Stack)(() => ({
  position: 'absolute',
  bottom: 4,
  left: 0,
  transform: 'translateX(-100%)',
}));

const MessageActionsUser: React.FC<Props> = ({ className, onClickEdit, disabled }) => {
  const coreSlots = useChatCoreSlots();
  const locale = useLocalizationContext();

  return (
    <RootStyled
      direction="row"
      alignItems="center"
      gap={1.5}
      className={className}
      px={1.5}
    >
      <Tooltip
        title={locale.messageEdit}
      >
        <coreSlots.iconButton
          size="small"
          disabled={disabled}
          onClick={onClickEdit}
        >
          <EditIcon />
        </coreSlots.iconButton>
      </Tooltip>
    </RootStyled>
  );
}

export default MessageActionsUser;
