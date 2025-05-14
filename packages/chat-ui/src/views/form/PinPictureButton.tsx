import * as React from 'react';
import {
  AddAPhotoIcon,
  FolderIcon,
  PhotoCameraIcon,
} from 'icons';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useMobile } from '../../ui/Responsive';
import Stack from '@mui/material/Stack';
import { useLocalizationContext } from '../core/LocalizationContext';
import MdMenu from '../../ui/menu/MdMenu';
import { ChatViewConstants } from '../ChatViewConstants';
import { useSnackbar } from '../hooks/useSnackbar';
import { useChatContext } from '../core/ChatGlobalContext';
import { useThreadContext } from '../thread/ThreadContext';

type Props = {
  images: string[];
  setImages: (images: string[]) => void;
  isTyping?: boolean;
};

const PinPictureButton: React.FC<Props> = ({ images, setImages, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const { enableImageAttachments } = useChatContext();
  const { thread } = useThreadContext();

  const ref = React.useRef<HTMLInputElement>(null);
  const mobileRef = React.useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMobile = useMobile();
  const snackbar = useSnackbar();
  const locale = useLocalizationContext();

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

  const disabled = images.length >= ChatViewConstants.MAX_IMAGES_IN_MESSAGE || isTyping || !thread;
  if (!enableImageAttachments) return null;
  return (
    <Stack
      alignItems="flex-end"
      width={48}
      height={40}
      position="relative"
    >
      <coreSlots.iconButton disabled={disabled} onClick={handleClick}>
        <AddAPhotoIcon />
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
        capture
        type="file"
        accept="image/png,image/jpeg"
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <input
        ref={ref}
        multiple
        type="file"
        accept="image/png,image/jpeg"
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </Stack>
  );
};

export default PinPictureButton;
