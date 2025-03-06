import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ChatMarkdown from './ChatMarkdown';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';
import { materialTheme } from '../../../utils/materialDesign/materialTheme';

type Props = {
  text: string;
  id?: string;
  className?: string;
};

const BoxStyled = styled(Box)(() => ({
  ...materialTheme.body.mediumArticle,
  width: '100%',
  wordWrap: 'break-word',
  fontFamily: 'Roboto',
  color: materialDesignSysPalette.onSurface,
  '& ol, p, ul': {
    margin: 0,
  },
  '& div:first-of-type': {
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

const ChatMarkdownBlock: React.FC<Props> = ({ text, id, className }) => {
  return (
    <BoxStyled id={id} className={className}>
      <ChatMarkdown text={text} />
    </BoxStyled>
  );
}

export default ChatMarkdownBlock;
