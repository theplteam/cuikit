import React from 'react';
import Stack from '@mui/material/Stack';
import MessageFileListItem from './MessageFileListItem';
import { IdType } from '../../../types';
import AttachmentModel from '../../../models/AttachmentModel';

type Props = {
  items: AttachmentModel[];
  onDeleteItem?: (id: IdType) => void;
};

const MessageFileList: React.FC<Props> = ({ items, onDeleteItem }) => {
  return (
    <Stack
      gap={1}
      flexDirection='column'
      justifySelf="end"
      flexWrap="nowrap"
    >
      {items.map((item, index) => (
        <MessageFileListItem
          key={index}
          item={item}
          onDelete={onDeleteItem}
        />
      ))}
    </Stack>
  );
}

export default MessageFileList;
