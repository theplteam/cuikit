import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';
import { motion } from '../../../utils/materialDesign/motion';
import { historyClassNames } from '../../core/history/historyClassNames';
import { HISTORY_ITEM_HEIGHT } from './historyListMetrics';

const ThreadListMapBlockAllStyled = styled(Stack)(({ theme }) => ({
  position: 'relative',
  [`& .${historyClassNames.listItem}`]: {
    height: HISTORY_ITEM_HEIGHT,
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
      backgroundColor: theme.palette.action.hover,
      [`& .${iconButtonClasses.root}`]: {
        opacity: 1,
      },
    },
    [`&.${historyClassNames.listItemSelected}`]: {
      backgroundColor: theme.palette.action.selected,
    },
  },
  // Hoisted out of two inline `sx` props on every row: at a thousand rows those
  // were ~2000 emotion serializations per render. They live here rather than on
  // the virtualization wrapper because the non-virtual branch has no wrapper,
  // and that is the branch every existing consumer gets.
  [`& .${historyClassNames.listItemText}`]: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  [`& .${historyClassNames.listItemMenuButton}`]: {
    position: 'absolute',
    right: theme.spacing(1.5),
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

export default ThreadListMapBlockAllStyled;
