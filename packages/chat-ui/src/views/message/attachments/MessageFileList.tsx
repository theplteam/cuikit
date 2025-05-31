import React from 'react';
import Stack from '@mui/material/Stack';
import MessageFileListItem from './MessageFileListItem';
import { IdType } from '../../../types';
import AttachmentModel from '../../../models/AttachmentModel';
import Scrollbar from '../../../ui/Scrollbar';
import { useElementRefState } from '../../../views/hooks/useElementRef';

type Props = {
  items: AttachmentModel[];
  onDeleteItem?: (id: IdType) => void;
};

const MessageFileList: React.FC<Props> = ({ items, onDeleteItem }) => {
  const { element, setElement } = useElementRefState();
  const hasScroll = element ? element.scrollWidth > element.clientWidth : false;

  return (
    <Scrollbar style={{ maxWidth: '100%' }}>
      <Stack
        ref={setElement}
        gap={1}
        flexDirection='row'
        justifySelf="end"
        paddingBottom={hasScroll ? 1.5 : 0}
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
