import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageUserEditorTextfield from './MessageUserEditorTextfield';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useLocalizationContext } from '../../core/LocalizationContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MessageModel } from '../../../models/MessageModel';

type Props = {
  message: MessageModel;
  onClickApply: (text: string) => void;
  onClickCancel: () => void;
};

const MessageUserEditor: React.FC<Props> = ({ onClickApply, onClickCancel, message }) => {
  const [newText, setNewText] = React.useState(message.text);
  const coreSlots = useChatCoreSlots();
  const locale = useLocalizationContext();
  const { enableFileAttachments, disableFileAttachmentsEditing } = useChatContext();
  const deletedIds = useObserverValue(message.attachments.deletedIds);

  const onClick = () => {
    if (!disabled) {
      onClickApply(newText);
    }
  }

  const disabled = (enableFileAttachments && !disableFileAttachmentsEditing)
    ? deletedIds?.length
      ? message.attachments.itemsAll.value.length === deletedIds.length && !newText
      : message.text === newText
    : (message.text === newText || !newText);

  return (
    <Stack
      gap={1.5}
      width="100%"
    >
      <MessageUserEditorTextfield
        newText={newText}
        setNewText={setNewText}
        onEnterPress={onClick}
      />
      <Stack gap={1.5} direction="row">
        <coreSlots.button
          variant="outlined"
          onClick={onClickCancel}
        >
          {locale.cancel}
        </coreSlots.button>
        <coreSlots.button
          disabled={disabled}
          variant="contained"
          onClick={onClick}
        >
          {locale.send}
        </coreSlots.button>
      </Stack>
    </Stack>
  );
}

export default MessageUserEditor;
