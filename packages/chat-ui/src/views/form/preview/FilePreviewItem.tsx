import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import Stack from '@mui/material/Stack';
import PreviewDeleteButton from './PreviewDeleteButton';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';

type Props = {
  file: MessageAttachmentModel;
  handleDelete?: (id: number, url: string) => void;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 64,
  width: 180,
  borderRadius: 16,
  backgroundColor: theme.palette.grey[200],
  '& img': {
    height: 48,
    width: 48,
    borderRadius: 16,
  },
}));

const FilePreviewItem: React.FC<Props> = ({ file, handleDelete }) => {
  const { url, id, name, type } = file;
  const progress = useObserverValue(file.progress);
  const poster = useObserverValue(file.poster);

  const Icon = React.useMemo(() => {
    let icon = InsertDriveFileIcon;
    if (type.startsWith('video')) icon = VideoFileIcon;
    if (type.startsWith('audio')) icon = AudioFileIcon;
    if (type.startsWith('text')) icon = DescriptionIcon;
    return icon;
  }, []);

  const ellipsis = React.useMemo(() => {
    if (name.length <= 12) return name;
    const split = name.split('.');
    const end = split[split.length - 2].slice(-3);
    const start = split[0].slice(0, 3);
    return `${start}...${end}.${split[split.length - 1]}`;
  }, []);

  return (
    <BoxStyled>
      <Stack
        width='100%'
        height='100%'
        alignItems='center'
        justifyItems='center'
        flexDirection="row"
        gap={1}
      >
        <Stack sx={{ position: 'relative' }} paddingLeft={1} alignItems="center">
          {(progress && progress < 100) ? <CircularLoadProgress progress={progress || 0} /> : null}
          {poster
            ? <img src={poster.src} />
            : <Icon color="primary" fontSize="large" />}
        </Stack>
        <p style={{ margin: 0 }}>
          {ellipsis}
        </p>
      </Stack>
      {handleDelete ? <PreviewDeleteButton onClick={() => handleDelete(id, url)} /> : null}
    </BoxStyled>
  );
};

export default FilePreviewItem;
