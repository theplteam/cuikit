import * as React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButtonProps } from '@mui/material/IconButton';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { IdType } from '../../types';

type Props = IconButtonProps & {
  threadId: IdType;
};

const ThreadListItemMenuButton: React.FC<Props> = ({ threadId, ...props }) => {
  const coreSlots = useChatCoreSlots();

  return (
    <coreSlots.iconButton
      {...props}
    >
      <MoreVertIcon />
    </coreSlots.iconButton>
  );
}

export default ThreadListItemMenuButton;
