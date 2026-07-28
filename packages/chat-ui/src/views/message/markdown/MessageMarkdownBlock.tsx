import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import { v4 as uuid } from 'uuid';
import MessageMarkdown from './MessageMarkdown';
import { SlotValue } from '../../core/usePropsSlots';
import clsx from 'clsx';
import { chatClassNames } from '../../core/chatClassNames';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useResolvedSpeed } from '../../core/useResolvedSpeed';
import { IdType } from '../../../types';

type Props = {
  text: string;
  messageId: IdType;
  rootComponent: SlotValue<BoxProps>;
  rootComponentProps: BoxProps | undefined;
  inProgress: boolean;
};

export const ChatMarkdownBlockRoot = styled(Box)(({ theme }) => ({
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

const MessageMarkdownBlock: React.FC<Props> = ({ text, messageId, inProgress, ...otherProps }) => {
  const { processAssistantText, customMarkdownComponents } = useChatContext();
  const { typing: typingSpeed, stagger } = useResolvedSpeed();

  // Prefix with `md-` so the DOM id never starts with a digit (invalid for CSS selectors).
  // Empty deps: keep the id stable for the component's lifetime — the message id can
  // change mid-stream, and re-generating the id would break the DOM node.
  const markdownId = React.useMemo(() => `md-${messageId}-${uuid()}`, []);

  return (
    <otherProps.rootComponent
      {...otherProps.rootComponentProps}
      className={clsx(otherProps.rootComponentProps?.className, chatClassNames.markdownParentRoot)}
      id={markdownId}
    >
      <MessageMarkdown
        inProgress={inProgress}
        text={text}
        processAssistantText={processAssistantText}
        customMarkdownComponents={customMarkdownComponents}
        stagger={stagger}
        typingSpeed={typingSpeed}
      />
    </otherProps.rootComponent>
  );
}

export default MessageMarkdownBlock;
