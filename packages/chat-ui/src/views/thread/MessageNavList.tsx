import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { drawerClasses } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { MessageModel } from '../../models/MessageModel';
import { MessageNavJumpOptions } from './useMessageNavController';
import { getMessageNavPreview } from './messageNavPreview';
import { useChatSlots, useChatCoreSlots } from '../core/ChatSlotsContext';
import { useLocalizationContext } from '../core/LocalizationContext';
import { langReplace } from '../../locale/langReplace';
import { chatClassNames } from '../core/chatClassNames';
import { CloseIcon } from '../../icons';
import SimpleScrollbar from '../../ui/SimpleScrollbar';
import { getSurfaceColor } from '../utils/colors';

export type MessageNavListProps = {
  /**
   * User messages of the current branch — one row per message.
   */
  userMessages: MessageModel[];
  /**
   * Index of the message the thread is currently scrolled to.
   */
  activeIndex: number;
  onJump: (index: number, options?: MessageNavJumpOptions) => void;
};

/**
 * A single entry is not worth a button of its own — the message is already on screen.
 */
const MIN_MESSAGES = 2;
const PREVIEW_MAX_LENGTH = 90;
const LIST_MAX_HEIGHT = 420;
/**
 * Sits above the composer, mirroring the offset the scroll-to-bottom button uses.
 */
const TRIGGER_TOP_OFFSET = -64;

const TriggerStyled = styled(Box)({
  position: 'absolute',
  right: 16,
  top: TRIGGER_TOP_OFFSET,
  zIndex: 1,
});

const RowStyled = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1.5, 2),
  border: 'none',
  background: 'transparent',
  textAlign: 'start',
  cursor: 'pointer',
  color: theme.palette.text.primary,
  '&[data-active="true"]': {
    background: theme.palette.action.selected,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
}));

// Spans, not Typography: a button may only contain phrasing content, and Typography
// renders a paragraph by default.
const NumberStyled = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  flexShrink: 0,
  minWidth: 20,
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums',
}));

const TextStyled = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  wordBreak: 'break-word',
}));

const MessageNavList: React.FC<MessageNavListProps> = ({ userMessages, activeIndex, onJump }) => {
  const [open, setOpen] = React.useState(false);
  /**
   * Stays true until the sheet has finished sliding away. The rows are built behind it,
   * so that scrolling the thread — which re-renders this component on every active
   * message change — does not build a list nobody is looking at.
   */
  const [rendered, setRendered] = React.useState(false);

  const { slots } = useChatSlots();
  const coreSlots = useChatCoreSlots();
  const locale = useLocalizationContext();

  /**
   * A long thread should open on the message you are reading, not at the top.
   * Attached to the active row only, so it runs when the drawer actually mounts
   * its content — an effect here would fire a commit too early.
   */
  const activeRowRef = React.useCallback((element: HTMLButtonElement | null) => {
    element?.scrollIntoView({ block: 'center' });
  }, []);

  const handleOpen = React.useCallback(() => {
    setRendered(true);
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => setOpen(false), []);

  const handleExited = React.useCallback(() => setRendered(false), []);

  const handleSelect = React.useCallback((index: number) => {
    setOpen(false);
    onJump(index);
  }, [onJump]);

  // The messages of a branch do not change while it is being read, unlike the active one
  const previews = React.useMemo(
    () => userMessages.map((message) => getMessageNavPreview(message, PREVIEW_MAX_LENGTH)),
    [userMessages],
  );

  if (userMessages.length < MIN_MESSAGES) return null;

  return (
    <>
      <TriggerStyled className={chatClassNames.messageNavListButton}>
        <coreSlots.iconButton
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={locale.messageNavTitle}
          sx={{
            background: (theme) => getSurfaceColor(theme),
            boxShadow: '0px 1px 18px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 3px 5px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: (theme) => getSurfaceColor(theme),
            },
          }}
          size="small"
          onClick={handleOpen}
        >
          <slots.messageNavIcon />
        </coreSlots.iconButton>
      </TriggerStyled>
      <Drawer
        anchor="bottom"
        open={open}
        PaperProps={{
          'aria-label': locale.messageNavTitle,
          'aria-modal': true,
          className: chatClassNames.messageNavList,
          role: 'dialog',
        }}
        SlideProps={{ onExited: handleExited }}
        sx={{
          [`.${drawerClasses.paper}`]: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
        onClose={handleClose}
      >
        <Stack pt={0.5} pb={1}>
          <Stack px={0.5} direction="row" alignItems="center">
            <coreSlots.iconButton
              aria-label={locale.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </coreSlots.iconButton>
            <Typography variant="subtitle1">
              {locale.messageNavTitle}
            </Typography>
          </Stack>
          <SimpleScrollbar style={{ maxHeight: LIST_MAX_HEIGHT }}>
            <Stack component="nav" aria-label={locale.messageNavTitle}>
              {!!rendered && userMessages.map((message, index) => (
                <RowStyled
                  key={message.id}
                  ref={index === activeIndex ? activeRowRef : undefined}
                  aria-current={index === activeIndex || undefined}
                  data-active={index === activeIndex}
                  type="button"
                  onClick={() => handleSelect(index)}
                >
                  <NumberStyled>
                    {index + 1}
                  </NumberStyled>
                  <TextStyled>
                    {previews[index] || langReplace(locale.messageNavItem, { number: index + 1 })}
                  </TextStyled>
                </RowStyled>
              ))}
            </Stack>
          </SimpleScrollbar>
        </Stack>
      </Drawer>
    </>
  );
};

export default MessageNavList;
