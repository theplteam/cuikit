import * as React from 'react';
import { useSendShortcutKeyDown } from '../../hooks/useSendShortcut';
import { useTablet } from '../../../ui/Responsive';
import { useChatSlots } from '../../../views/core/ChatSlotsContext';

type Props = {
  newText: string;
  setNewText: (newText: string) => void;
  onEnterPress: () => void;
};

const MessageUserEditorTextfield: React.FC<Props> = ({ newText, setNewText, onEnterPress: onEnterPressCallback }) => {
  const { slots, slotProps } = useChatSlots();
  const isTablet = useTablet();
  const onSendShortcutKeyDown = useSendShortcutKeyDown(onEnterPressCallback);

  return (
    <slots.messageEditInput
      multiline
      value={newText}
      maxRows={7}
      onChange={(event) => setNewText(event.target.value)}
      onKeyDown={!isTablet ? onSendShortcutKeyDown : undefined}
      {...slotProps.messageEditInput}
    />
  );
}

export default MessageUserEditorTextfield;
