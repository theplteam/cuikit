import * as React from 'react';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from './../../../utils/materialDesign/palette';

type Props = React.JSX.IntrinsicElements['blockquote'];

const BlockquoteStyled = styled('blockquote')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1),
  borderLeft: `2px solid ${materialDesignSysPalette.surfaceContainer}`,
  'p': {
    whiteSpace: 'break-spaces',
  }
}))

const ChatMessageBlockquote: React.FC<Props> = (props) => {
  return (
    <BlockquoteStyled {...props} />
  );
}

export default ChatMessageBlockquote;
