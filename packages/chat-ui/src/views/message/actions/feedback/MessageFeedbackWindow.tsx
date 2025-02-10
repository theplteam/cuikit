import * as React from 'react';
import { materialDesignSysPalette } from '../../../../utils/materialDesign/palette';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import { lng } from '../../../../utils/lng';
import { useChatCoreSlots } from '../../../core/ChatSlotsContext';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { dislikeFeedbackTags, likeFeedbackTags } from './feedbackTags';
import Chip from '@mui/material/Chip';
import { Popover } from '@mui/material';
import { MessageLight } from '../../../../models/Message';
import { useChatContext } from '../../../../views/core/ChatGlobalContext';

type Props = {
  message: MessageLight;
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

const MessageFeedbackWindow: React.FC<Props> = ({ message, anchorEl, onClose }) => {
  const [feedback, setFeedback] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const chatContext = useChatContext();
  const coreSlots = useChatCoreSlots();

  const handelClear = () => {
    setFeedback('');
    setTags([]);
  }

  React.useEffect(() => {
    if (anchorEl) handelClear();
  }, [anchorEl])

  const tagArray = message.rating === 'like' ? likeFeedbackTags : dislikeFeedbackTags;

  const handleSubmit = () => {
    chatContext.onSendFeedback?.({ message, feedback, tags });
    onClose();
  }

  const hangleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            borderRadius: 2,
            gap: 2,
            maxWidth: 500,
            backgroundColor: materialDesignSysPalette.surfaceContainerLow,
          }
        }
      }}
    >
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box display={'flex'} gap={1} flexDirection={'row'} alignItems={'center'}>
          <Typography variant='subtitle1'>
            {lng(['Почему вы выбрали этот рейтинг? ', 'Why did you choose this rating? '])}
          </Typography>
          <Typography variant='body2'>
            {lng(['(опционально)', '(optional)'])}
          </Typography>
        </Box>
        <coreSlots.iconButton size='small' onClick={onClose}>
          <CloseIcon />
        </coreSlots.iconButton>
      </Stack>
      <Stack width={'100%'} display={'flex'} direction={'row'} gap={1} flexWrap={'wrap'}>
        {tagArray.map((tag, i) => {
          const isActive = tags.includes(tag);

          return (
            <Box key={i}>
              <Chip
                label={tag}
                onClick={() => hangleTag(tag)}
                variant={isActive ? 'filled' : 'outlined'}
                sx={{
                  color: isActive ? materialDesignSysPalette.primary : materialDesignSysPalette.secondary,
                  backgroundColor: isActive ? materialDesignSysPalette.primaryContainer : undefined,
                }}
              />
            </Box>
          )
        })}
      </Stack>
      <InputBase
        placeholder={lng(['Предоставьте дополнительную информацию', 'Provide additional feedback'])}
        value={feedback}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFeedback(event.target.value);
        }}
        multiline
        maxRows={3}
        sx={{
          padding: 1,
          borderRadius: 2,
          border: '1px solid',
          borderColor: materialDesignSysPalette.outline,
        }}
      />
      <Typography variant='body2'>
        <Link target='_blank' href=''>
          {lng(['Узнайте больше', 'Learn more'])}
        </Link>
        {lng([' Открывается в новом окне, как ваши отзывы используются для улучшения Chat UI. ', ' Opens in a new window about how your feedback is used to improve Chat UI.'])}
      </Typography>
      <Box>
        <coreSlots.button
          disabled={!feedback && tags.length === 0}
          onClick={handleSubmit}
          variant='text'
        >
          {lng(['Отправить', 'Submit'])}
        </coreSlots.button>
      </Box>
    </Popover>
  );
}

export default MessageFeedbackWindow;
