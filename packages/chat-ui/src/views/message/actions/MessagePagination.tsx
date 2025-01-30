import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useDialogueContext } from '../../DialogueContext';
import { Message } from '../../../models/Message';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MdText } from '../../../ui/TextUi';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { materialTheme } from '../../../utils/materialDesign/materialTheme';

type Props = {
  message: Message;
  classes: {
    paginationClassName: string;
  };
  disabled?: boolean;
};

const StackStyled = styled(Stack)(() => ({

  paddingRight: 4,
}));

const MessagePagination: React.FC<Props> = ({ message, classes, disabled }) => {
  const { dialogueApi } = useDialogueContext();
  const coreSlots = useChatCoreSlots();
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
    <StackStyled
      direction={'row'}
      gap={0.5}
      alignItems={'center'}
      className={classes.paginationClassName}
      height={height}
    >
      {items.map(({ page, type, selected, ...item }) => {
        let children: React.ReactElement | null = null;

        if (type === 'page' && selected) {
          children = (
            <MdText m3color={'outline'} key={`page${page}`}>
              {`${page}/${branches.length}`}
            </MdText>
          );
        } else if (type === 'next' || type === 'previous') {
          children = (
            <coreSlots.iconButton
              {...item}
              size={'small'}
              key={type}
              disabled={item.disabled || disabled}
              sx={{
                fontSize: materialTheme.body.medium.fontSize,
                color: (theme) => theme.palette.grey[600],
              }}
            >
              {type === 'next' ? <ArrowForwardIosIcon fontSize={'inherit'} /> : <ArrowBackIosIcon fontSize={'inherit'} />}
            </coreSlots.iconButton>
          );
        }

        return children;
      })}
    </StackStyled>
  );
}

export default MessagePagination;
