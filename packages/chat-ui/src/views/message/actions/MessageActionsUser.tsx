import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { lng } from '../../../utils/lng';
import MdIconButton from '../../../ui/MdIconButton';

type Props = {
  className: string;
  onClickEdit: () => void;
  disabled?: boolean;
};

const RootStyled = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  transform: 'translateX(-100%)',
}));

const MessageActionsUser: React.FC<Props> = ({ className, onClickEdit, disabled }) => {
  return (
    <RootStyled
      direction={'row'}
      alignItems={'center'}
      gap={1.5}
      className={className}
      px={1.5}
    >
      <Tooltip
        title={lng(['Отредактировать сообщение', 'Edit message'])}
      >
        <MdIconButton
          size={'small'}
          onClick={onClickEdit}
          disabled={disabled}
        >
          <EditIcon />
        </MdIconButton>
      </Tooltip>
    </RootStyled>
  );
}

export default MessageActionsUser;
