import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import { useDialogueContext } from '../../DialogueContext';
import { Message } from '../../../models/Message';
import { useObserverValue } from '../../hooks/useObserverValue';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { materialTheme } from '../../../utils/materialDesign/materialTheme';

export type MessagePaginationProps = {
  message: Message;
  classes: {
    paginationClassName: string;
  };
  disabled?: boolean;
};

const MessagePagination: React.FC<MessagePaginationProps> = ({ message, classes, disabled }) => {
  const { dialogueApi } = useDialogueContext();
  const { slots, slotProps } = useChatSlots();
  const messages = useObserverValue(dialogueApi.current?.getListener('allMessages'), []);
  const branches = messages?.filter(v => v.parentId === message.parentId && v.isUser) ?? [];

  const height = 30;
  // console.log('page ' + (branches.findIndex(v => v.id === message.id) + 1), message.id, branches.map(v => v.id));
  const { items } = usePagination({
    count: branches.length,
    boundaryCount: 0,
    siblingCount: 0,
    defaultPage: branches.findIndex(v => v.id === message.id) + 1,
    onChange: (event, page) => dialogueApi.current?.handleChangeBranch(branches[page - 1]),
  });

  /*console.log(branches);
  console.log(dialogue.messages.map((v) => ({ text: v.text, id: v.parentId })));*/
  if (branches.length <= 1) return <Box height={height} />;
  return (
    <slots.messagePaginationRoot
      direction={'row'}
      pr={0.5}
      gap={0.5}
      alignItems={'center'}
      height={height}
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
              size={'small'}
              sx={{
                fontSize: materialTheme.body.medium.fontSize,
                color: (theme) => theme.palette.grey[600],
              }}
              {...slotProps?.messagePaginationButton}
              {...item}
              key={type}
              disabled={item.disabled || disabled}
            >
              {type === 'next' ? <ArrowForwardIosIcon fontSize={'inherit'} /> : <ArrowBackIosIcon fontSize={'inherit'} />}
            </slots.messagePaginationButton>
          );
        }

        return children;
      })}
    </slots.messagePaginationRoot>
  );
}

export default MessagePagination;
