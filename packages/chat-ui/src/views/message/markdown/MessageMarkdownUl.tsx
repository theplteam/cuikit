import { styled } from '@mui/material/styles';

const MessageMarkdownUl = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  paddingLeft: '1.625em',
  '& li': {
    paddingLeft: 6,
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    ...theme.typography.body1,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing(1.3),
      left: theme.spacing(-2),
      width: 6,
      height: 6,
      display: 'inline-block',
      borderRadius: '50%',
      background: theme.palette.primary.main,
    },
    'ul': {
      marginTop: theme.spacing(1.5),
    },
  },
  '&:dir(rtl)': {
    paddingLeft: 0,
    paddingRight: '1.625em',
    '& li': {
      paddingRight: 6,
      paddingLeft: 0,
      '&::before': {
        left: 'auto',
        right: theme.spacing(-2),
      }
    }
  },
}));

const ChatMessageOl = styled('ol')(({ theme }) => ({
  paddingLeft: '1.625em',
  '& li': {
    paddingLeft: 6,
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    ...theme.typography.body1,
    position: 'relative',
    '&::marker': {
      ...theme.typography.body1,
    },
    '& ul': {
      marginTop: theme.spacing(1.5),
    },
  },
  '&:dir(rtl)': {
    paddingLeft: 0,
    paddingRight: '1.625em',
    '& li': {
      paddingLeft: 0,
      paddingRight: 6,
    }
  },
}));

export { MessageMarkdownUl, ChatMessageOl };
