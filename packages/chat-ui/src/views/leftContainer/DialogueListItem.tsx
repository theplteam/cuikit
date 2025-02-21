import * as React from 'react';
import { styled } from '@mui/material/styles';
import DialogueListItemMenu from './DialogueListItemMenu';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import hexToRgba from 'hex-to-rgba';
import { ThreadModel } from '../../models/ThreadModel';
import { usePopoverState } from '../hooks/usePopoverState';
import { useObserverValue } from '../hooks/useObserverValue';
import { iconButtonClasses } from '@mui/material/IconButton';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { useChatCoreSlots } from '../../views/core/ChatSlotsContext';
import { motion } from '../../utils/materialDesign/motion';
import { Threads } from '../../models/Threads';

type Props = {
  // TODO: ANY
  model: Threads<any, any>;
  dialogue: ThreadModel;
  currentDialogue: ThreadModel | undefined;
  setDialogue: (dialogue: ThreadModel['data']['data']) => void;
};

const classSelected = 'boxSelected';
const classShadowRight = 'shadowRight';

const getGradient = (hex: string) => `linear-gradient(to left, ${hex} 0%, ${hex} 80%, ${hexToRgba(hex, 0)} 100%)`;

const BoxStyled = styled(Box)(({ theme }) => {
  return {
    height: 56,
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(1, 6.5, 1, 1.5),
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    [`& .${iconButtonClasses.root}`]: {
      [theme.breakpoints.up('md')]: {
        opacity: 0,
        transition: theme.transitions.create('opacity', { duration: motion.duration.short3 }),
      },
    },
    '&:hover': {
      background: materialDesignSysPalette.surfaceContainerHigh,
      [`& .${classShadowRight}`]: {
        backgroundImage: getGradient(materialDesignSysPalette.surfaceContainerHigh),
      },
      [`& .${iconButtonClasses.root}`]: {
        opacity: 1,
      },
    },
    [`&.${classSelected}`]: {
      background: 'rgb(225,233,240)',
      [`& .${classShadowRight}`]: {
        backgroundImage: getGradient('#e1e9f0'),
      }
    },
  }
});

const BoxShadowStyled = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  height: '100%',
  width: 65,
  pointerEvents: 'none',
  backgroundImage: getGradient(materialDesignSysPalette.surfaceContainerLow),
  [theme.breakpoints.down('sm')]: {
    backgroundImage: getGradient('#fff'),
  },
}));

const DialogueListItem: React.FC<Props> = ({ dialogue, model, currentDialogue, setDialogue }) => {
  const {
    anchorEl, handleClose, handleClick
  } = usePopoverState({ hideByAnchorElement: true });

  const coreSlots = useChatCoreSlots();

  const isEmpty = useObserverValue(dialogue.isEmpty);
  const title = useObserverValue(dialogue.data.observableTitle);

  if (isEmpty) return null;

  const selected = currentDialogue?.id === dialogue.id;

  const handleClickListItem = () => {
    model.actions.menuDriverOpen.value = false;
    setDialogue(dialogue);
  }

  return (
    <>
      <BoxStyled
        onClick={handleClickListItem}
        className={selected ? classSelected : undefined}
      >
        <coreSlots.listItemText
          primary={title ?? 'TITLE'}
          sx={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        />
        <BoxShadowStyled className={classShadowRight} />
        <coreSlots.iconButton
          size={'small'}
          onClick={handleClick}
          disabled={!dialogue.isOwner}
          sx={{
            position: 'absolute',
            right: (theme) => theme.spacing(1.5),
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <MoreVertIcon />
        </coreSlots.iconButton>
      </BoxStyled>
      <DialogueListItemMenu
        anchorEl={anchorEl}
        handleClose={handleClose}
        model={model}
        dialogue={dialogue}
      />
    </>
  );
};

export default React.memo(DialogueListItem, (prevProps, nextProps) => {
  return (prevProps.dialogue.id === prevProps.currentDialogue?.id) === (nextProps.dialogue.id === nextProps.currentDialogue?.id)
    && prevProps.dialogue.id === nextProps.dialogue.id;
});
