import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { Message } from '../../../models/Message';
import { lng } from '../../../utils/lng';
import { useChatSlots } from '../../core/ChatSlotsContext';


type Props = {
  message: Message;
};

const MessageActionLike: React.FC<Props> = ({ message }) => {
  const { coreSlots, slots } = useChatSlots();

  const handleClick = () => {
    console.log('like ID', message.id);
  }

  return (
    <>
      <Tooltip
        title={lng(['Хороший ответ', 'Like message'])}
      >
        <Box>
          <coreSlots.iconButton
            size={'small'}
            onClick={handleClick}
          >
            <slots.likeIcon />
          </coreSlots.iconButton>
        </Box>
      </Tooltip>
    </>
  );
}

export default MessageActionLike;
