import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ChatMarkdown from './ChatMarkdown';

type Props = {
  text: string;
  id?: string;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  ...theme.m3.materialTheme.body.mediumArticle,
  width: '100%',
  wordWrap: 'break-word',
  fontFamily: 'Roboto',
  color: theme.m3.sys.palette.onSurface,
  '& ol, p, ul': {
    margin: 0,
  },
  '& div:first-child': {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  '& code': {
    whiteSpace: 'pre-line',
  },
  '& table': {
    borderCollapse: 'collapse',
  },
}));

const ChatMarkdownBlock: React.FC<Props> = ({ text, id }) => {
  return (
    <BoxStyled id={id}>
      <ChatMarkdown text={text} />
    </BoxStyled>
  );
}

export default ChatMarkdownBlock;
