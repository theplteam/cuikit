import * as React from 'react';
import { styled } from '@mui/material/styles';
import {getSurfaceColor} from "../../utils/colors";

type Props = React.JSX.IntrinsicElements['code'];

const CodeStyled = styled('code')(({ theme }) => ({
  backgroundColor: getSurfaceColor(theme),
  padding: '.15rem .3rem',
  fontSize: '.875rem',
  borderRadius: 4,
}))

const MessageMarkdownCode: React.FC<Props> = (props) => {
  return (
    <CodeStyled {...props} />
  );
}

export default MessageMarkdownCode;
