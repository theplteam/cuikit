import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageUserEditorTextfield from './MessageUserEditorTextfield';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  text: string;
  onClickApply: (text: string) => void;
  onClickCancel: () => void;
};

const MessageUserEditor: React.FC<Props> = ({ text, onClickApply, onClickCancel }) => {
  const [newText, setNewText] = React.useState(text);
  const coreSlots = useChatCoreSlots();
  const locale = useLocalizationContext();

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
        <coreSlots.button
          onClick={onClickCancel}
          variant={'outlined'}
        >
          {locale.cancel}
        </coreSlots.button>
        <coreSlots.button
          onClick={onClick}
          disabled={text === newText || !newText}
          variant={'contained'}
        >
          {locale.send}
        </coreSlots.button>
      </Stack>
    </Stack>
  );
}

export default MessageUserEditor;
