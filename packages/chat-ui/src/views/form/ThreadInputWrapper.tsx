import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack, { StackProps } from '@mui/material/Stack';
import { inputBaseClasses } from '@mui/material/InputBase';
import { motion } from '../../utils/materialDesign/motion';
import { useChatContext } from '../core/ChatGlobalContext';

const StackStyled = styled(Stack)(({ theme }) => ({
  position: 'relative',
  outline: `1px solid ${theme.palette.divider}`,
  borderRadius: 24,
  padding: theme.spacing(1),
  transition: theme.transitions.create(
    ['border-radius', 'outline'], { duration: motion.duration.short2 }),
  [`&:has(.${inputBaseClasses.focused})`]: {
    outline: `2px solid ${theme.palette.primary.main}`,
  },
}));

const ThreadInputWrapper: React.FC<StackProps> = (props: StackProps) => {
  const { enableFileAttachments, toolsList } = useChatContext();
  const controlsInFooter = enableFileAttachments || !!toolsList?.length;

  return (
    <StackStyled 
      flexDirection={controlsInFooter ? 'column' : 'row'}
      alignItems={controlsInFooter ? undefined : 'flex-end'}
      {...props}
    />
  );
};

export default ThreadInputWrapper;
