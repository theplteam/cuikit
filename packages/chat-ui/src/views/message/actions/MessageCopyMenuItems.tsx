import * as React from 'react';
import { CodeIcon, HtmlIcon } from '../../../icons';
import { messageToHtml } from './messageToHtml';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  handleClose: () => void;
  text: string;
  short?: boolean;
};

const MessageCopyMenuItems: React.FC<Props> = ({ handleClose, text, short }) => {
  const { snackbar } = useChatContext();
  const { coreSlots } = useChatSlots();

  const locale = useLocalizationContext();
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(text)
      .then(() => snackbar.show(locale.messageCopiedToClipboard, 'info'));
    handleClose();
  }

  const handleCopyHTML = () => {
    const html = messageToHtml(text);
    navigator.clipboard.writeText(html)
      .then(() => snackbar.show(locale.messageCopiedToClipboard, 'info'));
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
