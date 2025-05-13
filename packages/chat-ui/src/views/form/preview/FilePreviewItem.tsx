import * as React from 'react';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import DescriptionIcon from '@mui/icons-material/Description';
import CircularLoadProgress from './CircularLoadProgress';

type Props = {
  file: MessageAttachmentModel;
  handleDelete: (id: number, url: string) => void;
};

const BoxStyled = styled(Box)(() => ({
  height: 30,
  width: 200,
  borderRadius: 8,
  padding: 2,
  backgroundColor: materialDesignSysPalette.surfaceContainerHighest,
}));

const FilePreviewItem: React.FC<Props> = ({ file, handleDelete }) => {
  const coreSlots = useChatCoreSlots();
  const { url, id, name } = file;
  const progress = useObserverValue(file.progress);

  const onDelete = () => {
    handleDelete(id, url);
  };

  return (
    <BoxStyled>
      {(progress && progress < 100) ? <CircularLoadProgress progress={progress || 0} /> : null}
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
    </BoxStyled>
  );
};

export default FilePreviewItem;
