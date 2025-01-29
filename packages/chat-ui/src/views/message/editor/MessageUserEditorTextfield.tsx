import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField/TextField';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import useEnterPress, { handleIgnoreEnterPress } from '../../hooks/useEnterPress';
import { useTablet } from '../../../ui/Responsive';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';

type Props = {
  newText: string;
  setNewText: (newText: string) => void;
  onEnterPress: () => void;
};

const TextFieldStyled = styled(TextField)(() => ({
  border: 'unset',
  [`& .${outlinedInputClasses.root}`]: {
    '& fieldset': {
      borderColor: materialDesignSysPalette.outline,
    },
    '&:hover fieldset': {
      borderColor: materialDesignSysPalette.onSurface,
    },
    [`&.${outlinedInputClasses.focused} fieldset`]: {
      borderColor: materialDesignSysPalette.primary,
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
