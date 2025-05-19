import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';
import React from 'react';

const useFilePreviewIcon = (type: string) => {
  const previewIcon = React.useMemo(() => {
    let icon = InsertDriveFileIcon;
    if (type.startsWith('video')) icon = VideoFileIcon;
    if (type.startsWith('audio')) icon = AudioFileIcon;
    if (type.startsWith('text')) icon = DescriptionIcon;
    return icon;
  }, [type]);

  return previewIcon;
}

export default useFilePreviewIcon;
