import React from 'react';
import Stack from '@mui/material/Stack';
import MessageFileListItem from './MessageFileListItem';
import { IdType } from '../../../types';
import AttachmentModel from '../../../models/AttachmentModel';
import Scrollbar from '../../../ui/Scrollbar';

type Props = {
  items: AttachmentModel[];
  onDeleteItem?: (id: IdType) => void;
};

const MessageFileList = ({ items, onDeleteItem }: Props) => {
  return (
    <Scrollbar style={{ maxWidth: '80%' }}>
      <Stack
        gap={1}
        flexDirection='row'
        justifySelf="end"
        paddingBottom={1.5}
      >
        {items.map((item, index) => (
          <MessageFileListItem
            key={index}
            item={item}
            onDelete={onDeleteItem}
          />
        ))}
      </Stack>
    </Scrollbar>
  );
}

export default MessageFileList;
