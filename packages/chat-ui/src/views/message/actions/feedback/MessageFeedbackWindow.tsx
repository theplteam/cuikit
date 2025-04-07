import * as React from 'react';
import { materialDesignSysPalette } from '../../../../utils/materialDesign/palette';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import { useChatCoreSlots } from '../../../core/ChatSlotsContext';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import { Popover } from '@mui/material';
import { useChatContext } from '../../../../views/core/ChatGlobalContext';
import { MessageModel } from '../../../../models/MessageModel';
import { useLocalizationContext } from '../../../../views/core/LocalizationContext';

type Props = {
  message: MessageModel;
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

const MessageFeedbackWindow: React.FC<Props> = ({ message, anchorEl, onClose }) => {
  const [feedback, setFeedback] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const locale = useLocalizationContext();
  const { onSendFeedback } = useChatContext();
  const coreSlots = useChatCoreSlots();

  const handelClear = () => {
    setFeedback('');
    setTags([]);
  }

  React.useEffect(() => {
    if (anchorEl) handelClear();
  }, [anchorEl])

  const tagArray = message.rating === 'like' ? locale.messageFeedbackLikeOptions : locale.messageFeedbackDislikeOptions;

  const handleSubmit = () => {
    onSendFeedback?.({ message: message.data, feedback, tags });
    onClose();
  }

  const handleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  if (!onSendFeedback) return null;
  return (
    <Popover
      open={Boolean(anchorEl)}
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
      onClose={onClose}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box
          display="flex" gap={1} flexDirection="row"
          alignItems="center"
        >
          <Typography variant='subtitle1'>
            {locale.messageFeedbackTitle}
          </Typography>
          <Typography variant='body2'>
            {locale.messageFeedbackSecondTitle}
          </Typography>
        </Box>
        <coreSlots.iconButton size='small' onClick={onClose}>
          <CloseIcon />
        </coreSlots.iconButton>
      </Stack>
      <Stack
        width="100%" display="flex" direction="row"
        gap={1} flexWrap="wrap"
      >
        {tagArray.map((tag, i) => {
          const isActive = tags.includes(tag);

          return (
            <Box key={i}>
              <Chip
                label={tag}
                variant={isActive ? 'filled' : 'outlined'}
                sx={{
                  color: isActive ? materialDesignSysPalette.primary : materialDesignSysPalette.secondary,
                  backgroundColor: isActive ? materialDesignSysPalette.primaryContainer : undefined,
                }}
                onClick={() => handleTag(tag)}
              />
            </Box>
          )
        })}
      </Stack>
      <InputBase
        multiline
        placeholder={locale.messageFeedbackPlaceholder}
        value={feedback}
        maxRows={3}
        sx={{
          padding: 1,
          borderRadius: 2,
          border: '1px solid',
          borderColor: materialDesignSysPalette.outline,
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFeedback(event.target.value);
        }}
      />
      <Typography variant='body2'>
        <Link target='_blank' href=''>
          {locale.messageFeedbackLink}
        </Link>
        {` ${locale.messageFeedbackText}`}
      </Typography>
      <Box>
        <coreSlots.button
          disabled={!feedback && tags.length === 0}
          variant='text'
          onClick={handleSubmit}
        >
          {locale.messageFeedbackSubmitButton}
        </coreSlots.button>
      </Box>
    </Popover>
  );
}

export default MessageFeedbackWindow;
