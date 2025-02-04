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

type Props = {
  feedback: FeedbackType | undefined;
};

export type FeedbackType = 'like' | 'dislike';

const MessageFeedbackWindow: React.FC<Props> = ({ feedback }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const coreSlots = useChatCoreSlots();

  const handelClear = () => {
    setText('');
    setTags([]);
  }

  const handelClose = () => {
    setIsOpen(false);
  }

  React.useEffect(() => {
    setIsOpen(!!feedback);
    handelClear();
  }, [feedback])

  if (!isOpen) return null;

  const tagArray = feedback === 'like' ? likeFeedbackTags : dislikeFeedbackTags;

  const handleSubmit = () => {
    console.log('text', text);
    console.log('tags', tags);
    handelClose();
  }

  const hangleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <Stack
      position={'absolute'}
      direction={'column'}
      top={50}
      padding={2}
      width={500}
      borderRadius={2}
      gap={2}
      sx={{
        backgroundColor: materialDesignSysPalette.surfaceContainerLow,
      }}
    >
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant='subtitle1'>
          {lng(['Почему вы выбрали этот рейтинг? (опционально)', 'Why did you choose this rating? (optional)'])}
        </Typography>
        <coreSlots.iconButton size='small' onClick={handelClose}>
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
        value={text}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value);
        }}
        multiline
        sx={{
          padding: '8px 8px',
          borderRadius: 2,
          border: '1px solid',
          borderColor: materialDesignSysPalette.outline,
        }}
      />
      <Typography variant='body2'>
        <Link target='_blank' href=''>
          {lng(['Узнайте больше', 'Learn more'])}
        </Link>
        {' '}
        {lng(['Открывается в новом окне, как ваши отзывы используются для улучшения Chat UI. ', 'Opens in a new window about how your feedback is used to improve Chat UI.'])}
      </Typography>
      <Box>
        <coreSlots.button
          disabled={!text && tags.length === 0}
          onClick={handleSubmit}
          variant='text'
        >
          {lng(['Отправить', 'Submit'])}
        </coreSlots.button>
      </Box>
    </Stack>
  );
}

export default MessageFeedbackWindow;
