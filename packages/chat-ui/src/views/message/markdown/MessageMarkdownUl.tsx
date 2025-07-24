import { styled } from '@mui/material/styles';
import React from 'react';

const StyledUl = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: '0px 1.625em',
  '& li': {
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    position: 'relative',
    ...theme.typography.body1,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing(1),
      left: theme.spacing(-3),
      width: 6,
      height: 6,
      margin: '2px 8px',
      display: 'inline-block',
      borderRadius: '50%',
      background: theme.palette.primary.main,
    },
    'ul': {
      marginTop: theme.spacing(1.5),
    },
  },
  '& li:dir(rtl)::before': {
    left: 'auto',
    right: theme.spacing(-3),
  },
}));

const ChatMessageOl = styled('ol')(({ theme }) => ({
  padding: '0px 1.625em',
  '& li': {
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
}));

const MessageMarkdownUl: React.FC<React.HTMLAttributes<HTMLUListElement>> = (props) => {

  return (
    <StyledUl
      {...props}
    />
  );
};

export { MessageMarkdownUl, ChatMessageOl };
