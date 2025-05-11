import * as React from 'react';
import Box from '@mui/material/Box';
import Scrollbar from '../../../ui/Scrollbar';
import MessageAttachmentModel from '../../../models/MessageAttachmentModel';
import FilePreviewItem from './FilePreviewItem';

type Props = {
  files: MessageAttachmentModel[];
  handleDelete: (id: number) => void;
};

const ChatFilePreview: React.FC<Props> = ({ files, handleDelete }) => {

  return (
    <Scrollbar style={{ maxHeight: 40, borderRadius: 16 }}>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        paddingRight="12px"
      >
        {files.map((file, i) => (
          <FilePreviewItem
            key={i}
            file={file}
            handleDelete={handleDelete}
          />
        ))}
      </Box>
    </Scrollbar>
  );
};

export default ChatFilePreview;
