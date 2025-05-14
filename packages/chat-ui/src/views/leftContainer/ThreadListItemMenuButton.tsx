import * as React from 'react';
import { MoreVertIcon } from '../../icons';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { IdType } from '../../types';

type Props = IconButtonProps & {
  threadId: IdType;
};

const ThreadListItemMenuButton: React.FC<Props> = ({ threadId, ...props }) => {
  return (
    <IconButton
      {...props}
    >
      <MoreVertIcon />
    </IconButton>
  );
}

export default React.memo(ThreadListItemMenuButton, (prevProps, nextProps) => {
  return prevProps.threadId === nextProps.threadId;
});;
