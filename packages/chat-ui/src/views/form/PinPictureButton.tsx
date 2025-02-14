import * as React from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FolderIcon from '@mui/icons-material/Folder';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useMobile } from '../../ui/Responsive';
import Stack from '@mui/material/Stack';
import { useLocalizationContext } from '../core/LocalizationContext';
import MdMenu from '../../ui/menu/MdMenu';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

type Props = {
  image: string;
  setImage: (img: string) => void;
  isTyping?: boolean;
};


const PinPictureButton: React.FC<Props> = ({ image, setImage, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const ref = React.useRef<HTMLInputElement>(null);
  const mobileRef = React.useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMobile = useMobile();
  const locale = useLocalizationContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setAnchorEl(event.currentTarget);
      return;
    }

    ref.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (ref.current?.value) ref.current.value = '';
    if (mobileRef.current?.value) mobileRef.current.value = '';
    if (isMobile) setAnchorEl(null);
  };

  return (
    <Stack
      alignItems={'flex-end'}
      width={48}
      height={40}
      position={'relative'}
    >
      <coreSlots.iconButton disabled={!!image || isTyping} onClick={handleClick}>
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
        accept="image/png,image/jpeg"
        onChange={handleImageUpload}
        disabled={isTyping}
        style={{ display: 'none' }}
      />
    </Stack>
  );
};

export default PinPictureButton;
