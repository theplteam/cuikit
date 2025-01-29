import * as React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useProcessAssistantText } from '../../hooks/useProcessAssistantText';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MessageCopyMenuItems from './MessageCopyMenuItems';
import { ChatMessage } from '../../../models/ChatMessage';
import { usePopoverState } from '../../hooks/usePopoverState';
import { lng } from '../../../utils/lng';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatCoreSlots } from '../../core/ChatGlobalContext';


type Props = {
  message: ChatMessage;
};

const MessageActionCopy: React.FC<Props> = ({ message }) => {
  const text = useProcessAssistantText(message.text);
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
