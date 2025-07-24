import * as React from 'react';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useMobile } from '../../../ui/Responsive';
import { useLocalizationContext } from '../../core/LocalizationContext';
import MdMenu from '../../../ui/menu/MdMenu';
import { PhotoCameraIcon, FolderIcon, AttachFileIcon } from '../../../icons';

export type FileAttachmentButtonFilesConfig = {
  multiple?: boolean;
  acceptableFileFormat?: string | string[];
};

export type FileAttachmentButtonProps = {
  disabled?: boolean;
  onOpenFileDialog: (config?: FileAttachmentButtonFilesConfig) => void;
  onOpenDeviceCamera: () => void;
};

const FileAttachmentButton: React.FC<FileAttachmentButtonProps> = ({disabled, onOpenFileDialog, onOpenDeviceCamera}) => {
  const coreSlots = useChatCoreSlots();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMobile = useMobile();
  const locale = useLocalizationContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setAnchorEl(event.currentTarget);
      return;
    }
    onOpenFileDialog();
  };

  const handleClickFileDialogue = () => {
    onOpenFileDialog();
    setAnchorEl(null);
  }

  const handleClickoDeviceCamera = () => {
    onOpenDeviceCamera();
    setAnchorEl(null);
  }

  return (
    <>
      <coreSlots.iconButton
        disabled={disabled}
        onClick={handleClick}
      >
        <AttachFileIcon />
      </coreSlots.iconButton>
      <MdMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <coreSlots.menuItem
          startIcon={PhotoCameraIcon}
          onClick={handleClickoDeviceCamera}
        >
          {locale.attachmentImageShot}
        </coreSlots.menuItem>
        <coreSlots.menuItem
          startIcon={FolderIcon}
          onClick={handleClickFileDialogue}
        >
          {locale.attachmentImageGallery}
        </coreSlots.menuItem>
      </MdMenu>
    </>
  );
};

export default FileAttachmentButton;
