import * as React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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
        backgroundColor: (theme) => theme.palette.common.white,
        ':hover': {
          backgroundColor: (theme) => theme.palette.grey[200],
        }
      }}
      onClick={onClick}
    >
      <CloseRoundedIcon fontSize='small' />
    </coreSlots.iconButton>
  )
}

export default PreviewDeleteButton;
