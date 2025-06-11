import {
  InsertDriveFileIcon,
  VideoFileIcon,
  AudioFileIcon,
  DescriptionIcon,
  ErrorOutlineOutlinedIcon
 } from '../../../icons';
import React from 'react';

const useFilePreviewIcon = (type: string) => {
  const previewIcon = React.useMemo(() => {
    let icon = InsertDriveFileIcon;
    if (type.startsWith('video')) icon = VideoFileIcon;
    if (type.startsWith('audio')) icon = AudioFileIcon;
    if (type.startsWith('text')) icon = DescriptionIcon;
    if (type === 'error') icon = ErrorOutlineOutlinedIcon;
    return icon;
  }, [type]);

  return previewIcon;
}

export default useFilePreviewIcon;
