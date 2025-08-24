import * as React from 'react';
import { CloseRoundedIcon } from '../../../icons';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';

type Props = {
  onClick: () => void;
}

const PreviewDeleteButton: React.FC<Props> = ({ onClick }) => {
  const coreSlots = useChatCoreSlots();
  return (
    <coreSlots.iconButton
      size='small'
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: (theme) => theme.palette.background.default,
        ':hover': {
          backgroundColor: (theme) => theme.palette.primary.dark,
        }
      }}
      onClick={onClick}
    >
      <CloseRoundedIcon fontSize='small' />
    </coreSlots.iconButton>
  )
}

export default PreviewDeleteButton;
