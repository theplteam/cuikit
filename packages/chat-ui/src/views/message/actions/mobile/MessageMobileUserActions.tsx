import * as React from 'react';
import { EditIcon, ContentCopyIcon } from '../../../../icons';
import { MessagesModeType } from '../../hooks/useMessagesMode';
import { MessageModel } from '../../../../models/MessageModel';
import { useChatContext } from '../../../core/ChatGlobalContext';
import { useChatSlots } from '../../../core/ChatSlotsContext';
import { useLocalizationContext } from '../../../core/LocalizationContext';

type Props = {
  message: MessageModel;
  modeManager: MessagesModeType;
  onClose: () => void;
};

const MessageMobileUserActions: React.FC<Props> = ({ message, modeManager, onClose }) => {
  const { coreSlots } = useChatSlots();
  const { snackbar } = useChatContext();
  const locale = useLocalizationContext();
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
      .then(() => snackbar.show(locale.messageCopiedToClipboard, 'info'));
    onClose();
  }

  return (
    <>
      <coreSlots.menuItem
        startIcon={ContentCopyIcon}
        onClick={handleCopy}
      >
        {['Копировать', 'Copy']}
      </coreSlots.menuItem>
      <coreSlots.menuItem
        startIcon={EditIcon}
        onClick={() => {
          modeManager.edit(message.id);
          onClose();
        }}
      >
        {['Редактировать', 'Edit']}
      </coreSlots.menuItem>
    </>
  );
}

export default MessageMobileUserActions;
