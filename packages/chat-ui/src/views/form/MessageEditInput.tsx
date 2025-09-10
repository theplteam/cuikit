import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField/TextField';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

const MessageEditInput = styled(TextField)(({ theme }) => ({
  [`& .${outlinedInputClasses.root}`]: {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.divider,
    },
    [`&.${outlinedInputClasses.focused} fieldset`]: {
      borderColor: theme.palette.primary.main,
    }
  }
}));

export default MessageEditInput;
