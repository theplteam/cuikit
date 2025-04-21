import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import ChatMarkdown from './ChatMarkdown';
import { SlotValue } from '../../core/usePropsSlots';

type Props = {
  text: string;
  id?: string;
  rootComponent: SlotValue<BoxProps>;
  rootComponentProps: BoxProps | undefined;
};

export const ChatMarkdownBlockRoot = styled(Box)(({theme}) => ({
  ...theme.typography.body2,
  width: '100%',
  wordWrap: 'break-word',
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

const ChatMarkdownBlock: React.FC<Props> = ({ text, id, ...otherProps }) => {
  return (
    <otherProps.rootComponent {...otherProps.rootComponentProps} id={id}>
      <ChatMarkdown text={text} />
    </otherProps.rootComponent>
  );
}

export default ChatMarkdownBlock;
