import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';

type Props = {
  onClick: () => void;
}

const PreviewDeleteButton = ({ onClick }: Props) => {
  const coreSlots = useChatCoreSlots();
  return (
    <coreSlots.iconButton
      size='small'
      sx={{
        position: 'absolute',
        padding: 0,
        top: 2,
        right: 4,
      }}
      onClick={onClick}
    >
      <CloseIcon sx={{ width: 18, height: 18 }} />
    </coreSlots.iconButton>
  )
}

export default PreviewDeleteButton;
