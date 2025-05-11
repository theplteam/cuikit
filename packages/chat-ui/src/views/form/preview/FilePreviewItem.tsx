import * as React from 'react';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';
import { useChatContext } from '../../core/ChatGlobalContext';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import DescriptionIcon from '@mui/icons-material/Description';
import LinearLoadProgress from './LinearLoadProgress';

type Props = {
  file: MessageAttachmentModel;
  handleDelete: (id: number) => void;
};

const BoxStyled = styled(Box)(() => ({
  height: 30,
  width: 200,
  borderRadius: 8,
  padding: 2,
  backgroundColor: materialDesignSysPalette.surfaceContainerHighest,
}));

const FilePreviewItem: React.FC<Props> = ({ file, handleDelete }) => {
  const { onFileAttached, model } = useChatContext();
  const [loading, setLoading] = React.useState(true);
  const coreSlots = useChatCoreSlots();
  const { url, data, id, name } = file;
  const progress = useObserverValue(file.progress);
  const currentThread = useObserverValue(model.currentThread);

  const onDelete = () => {
    handleDelete(id);
    URL.revokeObjectURL(url);
  };

  const setProgress = (n: number) => {
    file.progress.value = n;
  }

  const onFinish = () => {
    file.progress.value = 100;
    if (currentThread) {
      currentThread.isLoadingAttachments.value = currentThread.isLoadingAttachments.value.filter((v) => v !== id)
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (currentThread) {
      currentThread.isLoadingAttachments.value = [id, ...currentThread.isLoadingAttachments.value];
    }
    onFileAttached?.({ file: data, params: { setProgress, onFinish } });
  }, []);

  return (
    <BoxStyled>
      <Box
        display="flex"
        width='100%'
        alignItems='center'
        justifyContent='space-between'
        flexDirection="row"
      >
        <DescriptionIcon sx={{ color: materialDesignSysPalette.primary }} />
        <p style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
          maxWidth: 140,
        }}
        >
          {name}
        </p>
        <coreSlots.iconButton
          size='small'
          sx={{
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
      </Box>
      {!!loading && (
        <LinearLoadProgress progress={progress || 0} />
      )}
    </BoxStyled>
  );
};

export default FilePreviewItem;
