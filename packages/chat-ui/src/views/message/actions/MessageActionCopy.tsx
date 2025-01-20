import * as React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useProcessAssistantText } from '../../hooks/useProcessAssistantText';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MessageCopyMenuItems from './MessageCopyMenuItems';
import { ChatMessage } from '../../../models/ChatMessage';
import { usePopoverState } from '../../hooks/usePopoverState';
import { lng } from '../../../utils/lng';
import MdIconButton from '../../../ui/MdIconButton';
import MdMenu from '../../../ui/menu/MdMenu';


type Props = {
  message: ChatMessage;
};

const MessageActionCopy: React.FC<Props> = ({ message }) => {
  const text = useProcessAssistantText(message.text);

  const {
    anchorEl, handleClose, handleClick
  } = usePopoverState({ hideByAnchorElement: true });

  return (
    <>
      <Tooltip
        title={lng(['Скопировать сообщение', 'Copy message'])}
      >
        <Box>
          <MdIconButton
            size={'small'}
            onClick={handleClick}
          >
            <ContentCopyIcon />
          </MdIconButton>
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
