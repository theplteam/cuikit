import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ChatMarkdown from './ChatMarkdown';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';
import { materialTheme } from '../../../utils/materialDesign/materialTheme';

type Props = {
  text: string;
  id?: string;
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
  // ломает компонент кода
  // '& div:first-child': {
  //   display: 'flex',
  // flexDirection: 'column',
  //   gap: 16,
  // },
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
