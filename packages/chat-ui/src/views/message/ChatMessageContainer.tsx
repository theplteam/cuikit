import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

type Props = {
  elevation?: boolean;
};

const ChatMessageContainerStyled = styled(
  Box,
  { shouldForwardProp: (propName) => propName !== 'elevation' })
  <Props>(({ theme, elevation }) => ({
  display: 'flex',
  borderRadius: 24,
  padding: theme.spacing(1, 3),
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
  },
  minHeight: 40,
  boxShadow: elevation ? theme.m3.elevation.elevation7 : 'none',
}));

const ChatMessageContainer = React.forwardRef((props: BoxProps & Props, ref) => {
  return <ChatMessageContainerStyled {...props} ref={ref} />
});

export default ChatMessageContainer;
