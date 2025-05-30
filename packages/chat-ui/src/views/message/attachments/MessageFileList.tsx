import React from 'react';
import Stack from '@mui/material/Stack';
import MessageFileListItem from './MessageFileListItem';
import { IdType } from '../../../types';
import AttachmentModel from '../../../models/AttachmentModel';
import Scrollbar from '../../../ui/Scrollbar';
import MessageAttachmentSkeleton from './MessageAttachmentSkeleton';

type Props = {
  items: AttachmentModel[];
  expectedItems?: number;
  onDeleteItem?: (id: IdType) => void;
};

const MessageFileList: React.FC<Props> = ({ items, expectedItems = 0, onDeleteItem }) => {
  return (
    <Scrollbar style={{ maxWidth: '80%' }}>
      <Stack
        gap={1}
        flexDirection='row'
        justifySelf="end"
        paddingBottom={1.5}
      >
        {expectedItems > 0 ? <MessageAttachmentSkeleton itemsCount={expectedItems} variant='file' /> : null}
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
