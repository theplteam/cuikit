import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';
import { motion } from '../../../utils/materialDesign/motion';
import { historyClassNames } from '../../core/history/historyClassNames';

const ThreadListMapBlockAllStyled = styled(Stack)(({ theme }) => ({
  position: 'relative',
  [`& .${historyClassNames.historyListItem}`]: {
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
      backgroundColor: theme.palette.action.hover,
      [`& .${iconButtonClasses.root}`]: {
        opacity: 1,
      },
    },
    [`&.${historyClassNames.historyListItemSelected}`]: {
      backgroundColor: theme.palette.action.selected,
    },
  }
}));

export default ThreadListMapBlockAllStyled;
