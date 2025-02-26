import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';
import { materialTheme } from '../../../utils/materialDesign/materialTheme';

const ChatMessageUl = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  paddingLeft: '1.625em',
  '& li': {
    paddingLeft: '6px !important',
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    ...materialTheme.body.mediumArticle,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing(1),
      left: theme.spacing(-2),
      width: 6,
      height: 6,
      display: 'inline-block',
      borderRadius: '50%',
      background: materialDesignSysPalette.onPrimaryFixedVariant,
    },
    'ul': {
      marginTop: theme.spacing(1.5),
    }
  },
}));

const ChatMessageOl = styled('ol')(({ theme }) => ({
  paddingLeft: '1.625em',
  '& li': {
    paddingLeft: '6px !important',
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    ...materialTheme.body.mediumArticle,
    position: 'relative',
    '&::marker': {
      ...materialTheme.body.mediumArticle,
    },
    '& ul': {
      marginTop: theme.spacing(1.5),
    },
  },
}));

export { ChatMessageUl, ChatMessageOl };
