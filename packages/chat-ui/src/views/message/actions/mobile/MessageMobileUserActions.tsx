import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MessagesModeType } from '../../hooks/useMessagesMode';
import { ChatMessage } from '../../../../models/ChatMessage';
import MdMenuItem from '../../../../ui/menu/MdMenuItem';
import { useSnackbar } from '../../../hooks/useSnackbar';

type Props = {
  message: ChatMessage;
  modeManager: MessagesModeType;
  onClose: () => void;
};

const MessageMobileUserActions: React.FC<Props> = ({ message, modeManager, onClose }) => {
  const snackbar = useSnackbar();
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
      .then(() => snackbar.show(['Скопировано в буфер обмена', 'Copied to clipboard']));
    onClose();
  }

  return (
    <>
      <MdMenuItem
        startIcon={ContentCopyIcon}
        onClick={handleCopy}
      >
        {['Копировать', 'Copy']}
      </MdMenuItem>
      <MdMenuItem
        startIcon={EditIcon}
        onClick={() => {
          modeManager.edit(message.id);
          onClose();
        }}
      >
        {['Редактировать', 'Edit']}
      </MdMenuItem>
    </>
  );
}

export default MessageMobileUserActions;
