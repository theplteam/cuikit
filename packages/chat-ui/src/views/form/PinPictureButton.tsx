import * as React from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FolderIcon from '@mui/icons-material/Folder';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useMobile } from '../../ui/Responsive';
import Stack from '@mui/material/Stack';
import { useLocalizationContext } from '../core/LocalizationContext';
import MdMenu from '../../ui/menu/MdMenu';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { ChatViewConstants } from '../../views/ChatViewConstants';
import { useSnackbar } from '../../views/hooks/useSnackbar';

type Props = {
  images: string[];
  setImages: (images: string[]) => void;
  isTyping?: boolean;
};


const PinPictureButton: React.FC<Props> = ({ images, setImages, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const ref = React.useRef<HTMLInputElement>(null);
  const mobileRef = React.useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMobile = useMobile();
  const locale = useLocalizationContext();
  const snackbar = useSnackbar();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setAnchorEl(event.currentTarget);
      return;
    }

    ref.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(event.target.files || []);

    if (files.length + images.length > ChatViewConstants.MAX_IMAGES_IN_MESSAGE) {
      files = files.slice(0, ChatViewConstants.MAX_IMAGES_IN_MESSAGE - images.length);
      snackbar.show(locale.maxImageWarning);
    };

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);

    if (ref.current?.value) ref.current.value = '';
    if (mobileRef.current?.value) mobileRef.current.value = '';
    if (isMobile) setAnchorEl(null);
  };

  const disabled = images.length >= ChatViewConstants.MAX_IMAGES_IN_MESSAGE || isTyping;

  return (
    <Stack
      alignItems={'flex-end'}
      width={48}
      height={40}
      position={'relative'}
    >
      <coreSlots.iconButton disabled={disabled} onClick={handleClick}>
        <AddAPhotoIcon />
      </coreSlots.iconButton>
      <MdMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <coreSlots.menuItem
          startIcon={PhotoCameraIcon}
          onClick={() => mobileRef.current?.click()}
        >
          {locale.attachmentImageShot}
        </coreSlots.menuItem>
        <coreSlots.menuItem
          startIcon={FolderIcon}
          onClick={() => ref.current?.click()}
        >
          {locale.attachmentImageGallery}
        </coreSlots.menuItem>
      </MdMenu>
      <input
        ref={mobileRef}
        type="file"
        accept="image/png,image/jpeg"
        capture
        onChange={handleImageUpload}
        disabled={isTyping}
        style={{ display: 'none' }}
      />
      <input
        ref={ref}
        type="file"
        multiple
        accept="image/png,image/jpeg"
        onChange={handleImageUpload}
        disabled={isTyping}
        style={{ display: 'none' }}
      />
    </Stack>
  );
};

export default PinPictureButton;
