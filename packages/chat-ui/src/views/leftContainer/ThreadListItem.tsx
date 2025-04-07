import * as React from 'react';
import { styled } from '@mui/material/styles';
import ThreadListItemMenu from './ThreadListItemMenu';
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
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  thread: ThreadModel;
  currentThread: ThreadModel | undefined;
  setThread: (thread: ThreadModel['data']['data']) => void;
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

const ThreadListItem: React.FC<Props> = ({ thread, currentThread, setThread }) => {
  const {
    anchorEl, handleClose, handleClick
  } = usePopoverState({ hideByAnchorElement: true });

  const { apiRef } = useChatContext();

  const coreSlots = useChatCoreSlots();

  const isEmpty = useObserverValue(thread.isEmpty);
  const title = useObserverValue(thread.data.observableTitle);

  if (isEmpty) return null;

  const selected = currentThread?.id === thread.id;

  const handleClickListItem = () => {
    apiRef.current?.setMenuDriverOpen(false);
    setThread(thread.data.data);
  }

  return (
    <>
      <BoxStyled
        className={selected ? classSelected : undefined}
        onClick={handleClickListItem}
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
          size="small"
          sx={{
            position: 'absolute',
            right: (theme) => theme.spacing(1.5),
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </coreSlots.iconButton>
      </BoxStyled>
      <ThreadListItemMenu
        anchorEl={anchorEl}
        handleClose={handleClose}
        thread={thread}
      />
    </>
  );
};

export default React.memo(ThreadListItem, (prevProps, nextProps) => {
  return (prevProps.thread.id === prevProps.currentThread?.id) === (nextProps.thread.id === nextProps.currentThread?.id)
    && prevProps.thread.id === nextProps.thread.id;
});
