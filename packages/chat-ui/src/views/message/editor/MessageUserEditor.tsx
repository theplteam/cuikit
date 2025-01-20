import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageUserEditorTextfield from './MessageUserEditorTextfield';
import MdButton from '../../../ui/MdButton';

type Props = {
  text: string;
  onClickApply: (text: string) => void;
  onClickCancel: () => void;
};

const MessageUserEditor: React.FC<Props> = ({ text, onClickApply, onClickCancel }) => {
  const [newText, setNewText] = React.useState(text);

  const onClick = () => {
    if (text !== newText && !!newText) {
      onClickApply(newText);
    }
  }

  return (
    <Stack
      gap={1.5}
      width={'80%'}
      px={1.5}
    >
      <MessageUserEditorTextfield
        newText={newText}
        setNewText={setNewText}
        onEnterPress={onClick}
      />
      <Stack gap={1.5} direction={'row'}>
        <MdButton
          onClick={onClickCancel}
          variant={'outlined'}
        >
          {['Отменить', 'Cancel']}
        </MdButton>
        <MdButton
          onClick={onClick}
          disabled={text === newText || !newText}
          variant={'contained'}
        >
          {['Отправить', 'Send']}
        </MdButton>
      </Stack>
    </Stack>
  );
}

export default MessageUserEditor;
