import React from 'react';
import Stack from '@mui/material/Stack';
import MessageFileListItem from './MessageFileListItem';
import { IdType } from '../../../types';
import { LoadedAttachment } from './useMessageAttachments';

type Props = {
  items: LoadedAttachment[];
  onDeleteItem?: (id: IdType) => void;
};

const MessageFileList = ({ items, onDeleteItem }: Props) => {
  return (
    <Stack
      mx={1.5}
      gap={1}
      overflow="hidden"
      flexWrap="wrap"
      flexDirection="row"
      justifyContent="end"
    >
      {items.map((item, index) => (
        <MessageFileListItem
          key={index}
          item={item}
          onDelete={onDeleteItem}
        />
      ))}
    </Stack >
  );
}

export default MessageFileList;
