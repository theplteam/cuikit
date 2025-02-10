import * as React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MessageCopyMenuItems from './MessageCopyMenuItems';
import { MessageLight } from '../../../models/Message';
import { usePopoverState } from '../../hooks/usePopoverState';
import { lng } from '../../../utils/lng';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';


type Props = {
  message: MessageLight;
};

const MessageActionCopy: React.FC<Props> = ({ message }) => {
  const { proccessAssistantText } = useChatContext();

  let text = message.text;

  if (proccessAssistantText) {
    text = proccessAssistantText(message.text);
  }
  const coreSlots = useChatCoreSlots();

  const {
    anchorEl, handleClose, handleClick
  } = usePopoverState({ hideByAnchorElement: true });

  return (
    <>
      <Tooltip
        title={lng(['Скопировать сообщение', 'Copy message'])}
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
