import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { chatClassNames } from '../../core/chatClassNames';
import hexToRgba from 'hex-to-rgba';
import { iconButtonClasses } from '@mui/material/IconButton';
import { motion } from '../../../utils/materialDesign/motion';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';

const classSelected = 'boxSelected';
const classShadowRight = 'shadowRight';

const getGradient = (hex: string) => `linear-gradient(to left, ${hex} 0%, ${hex} 80%, ${hexToRgba(hex, 0)} 100%)`;

const ThreadListMapBlockAllStyled = styled(Stack)(({ theme }) => ({
  [`& .${chatClassNames.threadListItem}`]: {
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
}));

export default ThreadListMapBlockAllStyled;
