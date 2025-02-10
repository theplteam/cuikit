import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MessagesModeType } from '../../hooks/useMessagesMode';
import { MessageLight } from '../../../../models/Message';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { useChatSlots } from '../../../core/ChatSlotsContext';

type Props = {
  message: MessageLight;
  modeManager: MessagesModeType;
  onClose: () => void;
};

const MessageMobileUserActions: React.FC<Props> = ({ message, modeManager, onClose }) => {
  const { coreSlots } = useChatSlots();
  const snackbar = useSnackbar();
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
      .then(() => snackbar.show(['Скопировано в буфер обмена', 'Copied to clipboard']));
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
