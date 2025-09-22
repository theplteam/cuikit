import * as React from 'react';
import { ContentCopyIcon } from '../../../icons';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MessageCopyMenuItems from './MessageCopyMenuItems';
import { MessageModel } from '../../../models';
import { usePopoverState } from '../../hooks/usePopoverState';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import { useLocalizationContext } from '../../core/LocalizationContext';

type Props = {
  message: MessageModel;
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
            size="small"
            onClick={handleClick}
          >
            <ContentCopyIcon />
          </coreSlots.iconButton>
        </Box>
      </Tooltip>
      <MdMenu
        disablePortal
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MessageCopyMenuItems
          short
          text={text}
          handleClose={handleClose}
        />
      </MdMenu>
    </>
  );
}

export default MessageActionCopy;
