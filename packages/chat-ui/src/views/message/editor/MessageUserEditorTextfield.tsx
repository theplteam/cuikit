import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField/TextField';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import useEnterPress, { handleIgnoreEnterPress } from '../../hooks/useEnterPress';
import { useTablet } from '../../../ui/Responsive';

type Props = {
  newText: string;
  setNewText: (newText: string) => void;
  onEnterPress: () => void;
};

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  border: 'unset',
  [`& .${outlinedInputClasses.root}`]: {
    '& fieldset': {
      borderColor: theme.m3.sys.palette.outline,
    },
    '&:hover fieldset': {
      borderColor: theme.m3.sys.palette.onSurface,
    },
    [`&.${outlinedInputClasses.focused} fieldset`]: {
      borderColor: theme.m3.sys.palette.primary,
    }
  }
}));

const MessageUserEditorTextfield: React.FC<Props> = ({ newText, setNewText, onEnterPress: onEnterPressCallback }) => {

  const isTablet = useTablet();
  const onEnterPress = useEnterPress(onEnterPressCallback);

  return (
    <TextFieldStyled
      value={newText}
      multiline
      maxRows={7}
      // TODO: #ANY
      onChange={(event: any) => setNewText(event.target.value)}
      onKeyDown={!isTablet ? handleIgnoreEnterPress : undefined}
      onKeyUp={isTablet
        ? undefined
        : onEnterPress}
    />
  );
}

export default MessageUserEditorTextfield;
