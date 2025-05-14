import * as React from 'react';
import { keyframes, styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import ChatMarkdown from './ChatMarkdown';
import { SlotValue } from '../../core/usePropsSlots';
import { ChatViewConstants } from '../../ChatViewConstants';
import clsx from 'clsx';

type Props = {
  text: string;
  id?: string;
  rootComponent: SlotValue<BoxProps>;
  rootComponentProps: BoxProps | undefined;
  inProgress: boolean;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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
  [`.${ChatViewConstants.TEXT_SMOOTH_CLASSNAME_PENDING}`]: {
    opacity: 0,
  },
  [`.${ChatViewConstants.TEXT_SMOOTH_CLASSNAME_ANIMATE}`]: {
    opacity: 0,
    // here `delay` has no meaning, since it is overwritten in style for each element
    animation: `${fadeIn} ${ChatViewConstants.TEXT_SMOOTH_ANIMATION_DURATION_MS}ms ease-in-out 0ms 1 normal forwards`,
  },
}));

const ChatMarkdownBlock: React.FC<Props> = ({ text, id, inProgress, ...otherProps }) => {
  return (
    <otherProps.rootComponent
      {...otherProps.rootComponentProps}
      className={clsx(otherProps.rootComponentProps?.className, ChatViewConstants.MARKDOWN_PARENT_ROOT_CLASSNAME)}
      id={id}
    >
      <ChatMarkdown inProgress={inProgress} text={text} />
    </otherProps.rootComponent>
  );
}

export default ChatMarkdownBlock;
