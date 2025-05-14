import React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';

type Props = {
  item: File;
};

const StackStyled = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: 64,
  width: 120,
  borderRadius: 16,
  padding: "0 16px",
}));

const MessageFileListItem = ({ item }: Props) => {
  const { type, name } = item;

  const { splitName, fileFormat } = React.useMemo(() => {
    const splitName = name.split('.');
    const fileFormat = splitName.pop()?.toUpperCase() || 'FILE';
    return { splitName, fileFormat };
  }, []);

  const Icon = React.useMemo(() => {
    let icon = InsertDriveFileIcon;
    if (type.startsWith('video')) icon = VideoFileIcon;
    if (type.startsWith('audio')) icon = AudioFileIcon;
    if (type.startsWith('text')) icon = DescriptionIcon;
    return icon;
  }, []);

  const ellipsis = React.useMemo(() => {
    if (name.length <= 12) return splitName.join();
    const end = splitName[splitName.length - 1].slice(-5);
    const start = splitName[0].slice(0, 5);
    return `${start}...${end}`;
  }, []);

  return (
    <StackStyled
      gap={1}
      justifyContent='center'
      alignItems="end"
    >
      <p style={{ margin: 0 }}>
        {ellipsis}
      </p>
      <Stack flexDirection="row" alignItems='center' gap={1}>
        {fileFormat}
        <Icon color="primary" />
      </Stack>
    </StackStyled>
  );
}

export default MessageFileListItem;
