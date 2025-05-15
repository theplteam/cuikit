import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import { ArrowBackIosIcon, ArrowForwardIosIcon } from '../../icons';
import Box from '@mui/material/Box';
import { useThreadContext } from '../thread/ThreadContext';
import { MessageModel } from '../../models/MessageModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatSlots } from '../core/ChatSlotsContext';
import { useChatContext } from '../core/ChatGlobalContext';

export type MessagePaginationProps = {
  message: MessageModel;
  classes: {
    paginationClassName: string;
  };
  disabled?: boolean;
};

export const MessagePaginationHeight = 30

const MessagePagination: React.FC<MessagePaginationProps> = ({ message, classes, disabled }) => {
  const { apiRef } = useThreadContext();
  const { handleBranchPagination } = useChatContext();
  const { slots, slotProps } = useChatSlots();
  const messages = useObserverValue(apiRef.current?.getListener('allMessages'), []);

  const makeBranch = (currentMessage: MessageModel, messages: MessageModel[]) => {
    const filteredMessages = messages.filter(m => (m.role === message.role) && (m.parentId === currentMessage.parentId));
    return filteredMessages;
  }

  const branches = handleBranchPagination?.(message, messages || []) ?? makeBranch(message, messages || []) ?? [];

  const { items } = usePagination({
    count: branches.length,
    boundaryCount: 0,
    siblingCount: 0,
    defaultPage: branches.findIndex(v => v.id === message.id) + 1,
    onChange: (_event, page) => apiRef.current?.handleChangeBranch(branches[page - 1]),
  });

  if (branches.length <= 1) return <Box height={MessagePaginationHeight} />;

  return (
    <slots.messagePaginationRoot
      direction="row"
      pr={0.5}
      gap={0.5}
      alignItems="center"
      height={MessagePaginationHeight}
      className={classes.paginationClassName}
      {...slotProps?.messagePaginationRoot}
    >
      {items.map(({ page, type, selected, ...item }) => {
        let children: React.ReactElement | null = null;

        if (type === 'page' && selected) {
          children = (
            <slots.messagePaginationText
              {...slotProps?.messagePaginationText}
              key={`page${page}`}
            >
              {`${page}/${branches.length}`}
            </slots.messagePaginationText>
          );
        } else if (type === 'next' || type === 'previous') {
          children = (
            <slots.messagePaginationButton
              size="small"
              sx={{
                color: (theme) => theme.palette.grey[600],
              }}
              {...slotProps?.messagePaginationButton}
              {...item}
              key={type}
              disabled={item.disabled || disabled}
            >
              {type === 'next' ? <ArrowForwardIosIcon fontSize="inherit" /> : <ArrowBackIosIcon fontSize="inherit" />}
            </slots.messagePaginationButton>
          );
        }

        return children;
      })}
    </slots.messagePaginationRoot>
  );
}

export default MessagePagination;
