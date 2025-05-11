import * as React from 'react';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import 'photoswipe/style.css';

type Props = {
  image: MessageAttachmentModel;
  galleryId: string;
  handleDelete: (id: number) => void;
};

const BoxStyled = styled(Box)(() => ({
  position: 'relative',
  height: 64,
  width: 64,
  '& a': {
    height: 'inherit',
    width: 'inherit',
    lineHeight: 0,
    display: 'block',
  },
  '& img': {
    height: 'inherit',
    width: 'inherit',
    objectFit: 'cover',
    aspectRatio: 'auto',
    objectPosition: 'center',
    borderRadius: 16,
  },
}));

const ImagePreviewItem: React.FC<Props> = ({ image, galleryId, handleDelete }) => {
  const { onFileAttached, model } = useChatContext();
  const [loading, setLoading] = React.useState(true);
  const coreSlots = useChatCoreSlots();
  const { url, id, data, getImgSize } = image;
  const progress = useObserverValue(image.progress);
  const currentThread = useObserverValue(model.currentThread);
  const size = getImgSize();

  const onDelete = () => {
    handleDelete(id);
    URL.revokeObjectURL(url);
  };

  const setProgress = (n: number) => {
    image.progress.value = n;
  }

  const onFinish = () => {
    image.progress.value = 100;
    if (currentThread) {
      currentThread.isLoadingAttachments.value = currentThread.isLoadingAttachments.value.filter((v) => v !== id)
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (currentThread) {
      currentThread.isLoadingAttachments.value = currentThread.isLoadingAttachments.value.filter((v) => v !== id)
    }
    onFileAttached?.({ file: data, params: { setProgress, onFinish } });
  }, []);

  return (
    <BoxStyled>
      {!!loading && (
        <CircularLoadProgress progress={progress || 0} />
      )}
      <a
        key={`${galleryId}-${id}`}
        href={url}
        data-pswp-width={size?.width}
        data-pswp-height={size?.height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={url} alt="" />
      </a>
      <coreSlots.iconButton
        size='small'
        sx={{
          position: 'absolute',
          padding: 0,
          top: 0,
          right: 0,
          outline: `4px solid ${materialDesignSysPalette.surfaceContainerLowest}`,
          backgroundColor: materialDesignSysPalette.surfaceContainerHighest,
          ":hover": {
            backgroundColor: materialDesignSysPalette.surfaceContainerLow,
          },
        }}
        onClick={onDelete}
      >
        <CloseIcon sx={{ width: 16, height: 16 }} />
      </coreSlots.iconButton>
    </BoxStyled>
  );
};

export default ImagePreviewItem;
