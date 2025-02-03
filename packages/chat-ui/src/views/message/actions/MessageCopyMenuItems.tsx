import * as React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import HtmlIcon from '@mui/icons-material/Html';
import { messageToHtml } from './messageToHtml';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  handleClose: () => void;
  text: string;
  short?: boolean;
};

const MessageCopyMenuItems: React.FC<Props> = ({ handleClose, text, short }) => {
  const { coreSlots } = useChatSlots();
  const snackbar = useSnackbar();
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(text)
      .then(() => snackbar.show(['Скопировано в буфер обмена', 'Copied to clipboard']));
    handleClose();
  }

  const handleCopyHTML = () => {
    const html = messageToHtml(text);
    navigator.clipboard.writeText(html)
      .then(() => snackbar.show(['Скопировано в буфер обмена', 'Copied to clipboard']));
    handleClose();
  }

  return (
    <>
      <coreSlots.menuItem
        startIcon={CodeIcon}
        onClick={handleCopyMarkdown}
      >
        {short ? 'Markdown' : ['Копировать Markdown', 'Copy Markdown']}
      </coreSlots.menuItem>
      <coreSlots.menuItem
        startIcon={HtmlIcon}
        onClick={handleCopyHTML}
      >
        {short ? 'HTML' : ['Копировать HTML', 'Copy HTML']}
      </coreSlots.menuItem>
    </>
  );
}

export default MessageCopyMenuItems;
