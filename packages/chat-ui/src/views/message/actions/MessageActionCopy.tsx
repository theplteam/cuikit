import * as React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MessageCopyMenuItems from './MessageCopyMenuItems';
import { Message } from '../../../models/Message';
import { usePopoverState } from '../../hooks/usePopoverState';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useLocalizationContext } from '../../core/LocalizationContext';


type Props = {
  message: Message;
};

const MessageActionCopy: React.FC<Props> = ({ message }) => {
  const { processAssistantText } = useChatContext();
  const locale = useLocalizationContext();

  let text = message.text;

  if (processAssistantText) {
    text = processAssistantText(message.text);
  }
  const coreSlots = useChatCoreSlots();

  const {
    anchorEl, handleClose, handleClick
  } = usePopoverState({ hideByAnchorElement: true });

  return (
    <>
      <Tooltip
        title={locale.messageCopy}
      >
        <Box>
          <coreSlots.iconButton
            size={'small'}
            onClick={handleClick}
          >
            <ContentCopyIcon />
          </coreSlots.iconButton>
        </Box>
      </Tooltip>
      <MdMenu
        open={!!anchorEl}
        onClose={handleClose}
        anchorEl={anchorEl}
        disablePortal
      >
        <MessageCopyMenuItems
          text={text}
          handleClose={handleClose}
          short
        />
      </MdMenu>
    </>
  );
}

export default MessageActionCopy;
