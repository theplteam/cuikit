import * as React from 'react';
import MessageComponentBox from './MessageComponentBox';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

type Props = {
  gap: number;
};

const UserSkeletonStyled = styled(Skeleton)(({ theme }) => ({
  width: '80%',
  height: 40,
  borderRadius: 24,
  marginRight: theme.spacing(1.5),
}));

const AssistantMessageComponentStyled = styled(MessageComponentBox)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  paddingTop: theme.spacing(1),
}));

const AssistantRootStyled = styled(Box)(({ theme }) => ({
  width: '50%',
  padding: theme.spacing(0, 3),
}));

const MessageComponentSkeleton: React.FC<Props> = ({ gap }) => {
  return (
    <Stack
      width="100%"
      gap={gap}
    >
      <MessageComponentBox
        isUser

      >
        <UserSkeletonStyled variant="rectangular" />
      </MessageComponentBox>
      <AssistantMessageComponentStyled isUser={false}>
        <AssistantRootStyled>
          <Skeleton variant="text" />
        </AssistantRootStyled>
        <AssistantRootStyled>
          <Skeleton variant="text" />
        </AssistantRootStyled>
        <AssistantRootStyled>
          <Skeleton variant="text" />
        </AssistantRootStyled>
        <AssistantRootStyled>
          <Skeleton variant="text" />
        </AssistantRootStyled>

      </AssistantMessageComponentStyled>
    </Stack>
  );
}

export default MessageComponentSkeleton;
