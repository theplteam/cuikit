import * as React from 'react';
import { styled } from '@mui/material/styles';
import DialogueListItemMenu from './DialogueListItemMenu';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import hexToRgba from 'hex-to-rgba';
import { ChatDialogue } from '../../models/ChatDialogue';
import { ChatModel } from '../../models/ChatModel';
import MdIconButton, { iconButtonClasses } from '../../ui/MdIconButton';
import { usePopoverState } from '../hooks/usePopoverState';
import { useObserverValue } from '../hooks/useObserverValue';
import MdListItemText from '../../ui/list/MdListItemText';

type Props = {
  chat: ChatModel;
  dialogue: ChatDialogue;
  currentDialogue: ChatDialogue | undefined;
  setDialogue: (dialogue: ChatDialogue) => void;
};

const classSelected = 'boxSelected';
const classShadowRight = 'shadowRight';

const getGradient = (hex: string) => `linear-gradient(to left, ${hex} 0%, ${hex} 80%, ${hexToRgba(hex, 0)} 100%)`;

const BoxStyled = styled(Box)(({ theme }) => {
  const palette = theme.m3.sys.palette;

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
        transition: theme.transitions.create('opacity', { duration: theme.m3.sys.motion.duration.short3 }),
      },
    },
    '&:hover': {
      background: palette.surfaceContainerHigh,
      [`& .${classShadowRight}`]: {
        backgroundImage: getGradient(palette.surfaceContainerHigh),
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
  backgroundImage: getGradient(theme.rightBlock.backgroundColor),
  [theme.breakpoints.down('md')]: {
    backgroundImage: getGradient('#fff'),
  },
}));

const MdIconButtonStyled = styled(MdIconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1.5),
  top: '50%',
  transform: 'translateY(-50%)',
}));

const DialogueListItem: React.FC<Props> = ({ dialogue, chat, currentDialogue, setDialogue }) => {
  const {
    anchorEl, handleClose, handleClick
  } = usePopoverState({ hideByAnchorElement: true });

  const isEmpty = useObserverValue(dialogue.isEmpty);
  const title = useObserverValue(dialogue.data.observableTitle);

  if (isEmpty) return null;

  const selected = currentDialogue?.id === dialogue.id;

  const handleClickListItem = () => {
    chat.actions.menuDriverOpen.value = false;
    setDialogue(dialogue);
  }

  return (
    <>
      <BoxStyled
        onClick={handleClickListItem}
        className={selected ? classSelected : undefined}
      >
        <MdListItemText
          primary={title ?? 'TITLE'}
          sx={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        />
        <BoxShadowStyled className={classShadowRight} />
        <MdIconButtonStyled
          size={'small'}
          onClick={handleClick}
          disabled={!dialogue.isOwner}
        >
          <MoreVertIcon />
        </MdIconButtonStyled>
      </BoxStyled>
      <DialogueListItemMenu
        anchorEl={anchorEl}
        handleClose={handleClose}
        chat={chat}
        dialogue={dialogue}
      />
    </>
  );
};

export default React.memo(DialogueListItem, (prevProps, nextProps) => {
  return (prevProps.dialogue.id === prevProps.currentDialogue?.id) === (nextProps.dialogue.id === nextProps.currentDialogue?.id)
    && prevProps.dialogue.id === nextProps.dialogue.id;
});
