import * as React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import HtmlIcon from '@mui/icons-material/Html';
import { messageToHtml } from './messageToHtml';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  handleClose: () => void;
  text: string;
  short?: boolean;
};

const MessageCopyMenuItems: React.FC<Props> = ({ handleClose, text, short }) => {
  const { coreSlots } = useChatSlots();
  const snackbar = useSnackbar();
  const locale = useLocalizationContext();
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(text)
      .then(() => snackbar.show(locale.messageCopiedToClipboard));
    handleClose();
  }

  const handleCopyHTML = () => {
    const html = messageToHtml(text);
    navigator.clipboard.writeText(html)
      .then(() => snackbar.show(locale.messageCopiedToClipboard));
    handleClose();
  }

  return (
    <>
      <coreSlots.menuItem
        startIcon={CodeIcon}
        onClick={handleCopyMarkdown}
      >
        {short ? 'Markdown' : locale.messageCopyMarkdown}
      </coreSlots.menuItem>
      <coreSlots.menuItem
        startIcon={HtmlIcon}
        onClick={handleCopyHTML}
      >
        {short ? 'HTML' : locale.messageCopyHTML}
      </coreSlots.menuItem>
    </>
  );
}

export default MessageCopyMenuItems;
