import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useDialogueContext } from '../../DialogueContext';
import { ChatMessage } from '../../../models/ChatMessage';
import MdIconButton from '../../../ui/MdIconButton';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MdText } from '../../../ui/TextUi';

type Props = {
  message: ChatMessage;
  classes: {
    paginationClassName: string;
  };
  disabled?: boolean;
};

const StackStyled = styled(Stack)(() => ({

  paddingRight: 4,
}));

const MdIconButtonStyled = styled(MdIconButton)(({ theme }) => ({
  fontSize: theme.m3.materialTheme.body.medium.fontSize,
  color: theme.m3.sys.palette.outline,
}));

const MessagePagination: React.FC<Props> = ({ message, classes, disabled }) => {
  const { dialogueApi } = useDialogueContext();
  const messages = useObserverValue(dialogueApi.current?.getListener('branch'), []);
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
            <MdIconButtonStyled
              {...item}
              size={'small'}
              key={type}
              disabled={item.disabled || disabled}
            >
              {type === 'next' ? <ArrowForwardIosIcon fontSize={'inherit'} /> : <ArrowBackIosIcon fontSize={'inherit'} />}
            </MdIconButtonStyled>
          );
        }

        return children;
      })}
    </StackStyled>
  );
}

export default MessagePagination;
