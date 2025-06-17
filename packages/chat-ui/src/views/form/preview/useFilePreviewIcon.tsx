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
    switch (type) {
      case 'video':
        icon = VideoFileIcon;
        break;
      case 'audio':
        icon = AudioFileIcon;
        break;
      case 'text':
        icon = DescriptionIcon;
        break;
      case 'error':
        icon = ErrorOutlineOutlinedIcon;
        break;
    }

    return icon;
  }, [type]);

  return previewIcon;
}

export default useFilePreviewIcon;
