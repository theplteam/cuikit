import * as React from 'react';
import useEnterPress, { handleIgnoreEnterPress } from '../../hooks/useEnterPress';
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
  const onEnterPress = useEnterPress(onEnterPressCallback);

  return (
    <slots.messageEditInput
      multiline
      value={newText}
      maxRows={7}
      onChange={(event) => setNewText(event.target.value)}
      onKeyUp={isTablet
        ? undefined
        : onEnterPress}
      onKeyDown={!isTablet ? handleIgnoreEnterPress : undefined}
      {...slotProps.messageEditInput}
    />
  );
}

export default MessageUserEditorTextfield;
