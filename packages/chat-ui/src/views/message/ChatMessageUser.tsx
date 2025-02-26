import * as React from 'react';
import ChatMessageContainer from './ChatMessageContainer';
import { styled } from '@mui/material/styles';
import ChatMarkdownBlock from './markdown/ChatMarkdownBlock';
import { messageActionsClasses } from './messageActionsClasses';
import MessageActionsUser from './actions/MessageActionsUser';
import clsx from 'clsx';
import MessageUserEditor from './editor/MessageUserEditor';
import MessagePagination, { MessagePaginationHeight } from './MessagePagination';
import { MessageStateEnum } from './hooks/useMessagesMode';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useThreadContext } from '../thread/ThreadContext';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useElementRefState } from '../hooks/useElementRef';
import { useTablet } from '../../ui/Responsive';
import { useObserverValue } from '../hooks/useObserverValue';
import useHover from '../hooks/useHover';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import { useChatContext } from '../core/ChatGlobalContext';
import ChatMessageGallery from './ChatMessageGallery';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  isFirst?: boolean;
  elevation?: boolean;
};

const {
  actionsClassName,
  hoverMessageClassName,
  paginationClassName,
} = messageActionsClasses;

const ChatMessageContainerStyled = styled(ChatMessageContainer)(({ theme }) => ({
  width: '80%',
  background: materialDesignSysPalette.surfaceContainerLow,
  position: 'relative',
  [`& .${actionsClassName}`]: {
    opacity: 0,
    transition: theme.transitions.create('opacity', { duration: motion.duration.short3 }),
  },
  [`&.${hoverMessageClassName}`]: {
    [`& .${actionsClassName}`]: {
      opacity: 1,
    },
  },
  [`:has(.${paginationClassName})`]: {
    marginBottom: theme.spacing(1.5),
  }
}));

const ChatMessageUser: React.FC<Props> = ({ message, thread, isFirst, elevation }) => {
  const { element, setElement } = useElementRefState();
  const isTablet = useTablet();
  const isTyping = useObserverValue(thread?.isTyping);

  const { messageMode, apiRef } = useThreadContext();
  const { onAssistantMessageTypingFinish, enableBranches } = useChatContext();

  const mode = messageMode.values[message.id];

  const isHover = useHover(element);

  const onClickEdit = () => {
    messageMode.edit(message.id);
  }

  const onClickApplyEdit = async (newText: string) => {
    messageMode.view(message.id);
    const newMessage = thread.editMessage(message, newText);
    apiRef.current?.handleChangeBranch(newMessage);
    onAssistantMessageTypingFinish?.(thread.data.data);
  }

  const onClickCancelEdit = () => {
    messageMode.view(message.id);
  }

  const imageComponent = message.images?.length
    ? (
      <ChatMessageGallery
        images={message.images} id={message.id}
      />
    ) : null;

  const children = React.useMemo(() => (
    <>
      <ChatMarkdownBlock text={message.text} />
      {((isFirst || message.parentId) && !!enableBranches) ? <MessageActionsUser
        className={actionsClassName}
        disabled={isTyping}
        onClickEdit={onClickEdit}
                                                             /> : null}
    </>
  ), [message, thread, message.text, isFirst, isTyping]);

  if (mode === MessageStateEnum.EDIT) {
    return (
      <Stack width="100%" gap={1} alignItems="flex-end">
        {imageComponent}
        <MessageUserEditor
          text={message.text}
          onClickApply={onClickApplyEdit}
          onClickCancel={onClickCancelEdit}
        />
      </Stack>
    );
  }

  return (
    <Stack
      width="100%"
      alignItems="flex-end"
      sx={{ mb: 3 }}
      style={{ marginBottom: '-25px' }}
      gap={0.5}
    >
      <Box
        width="100%"
        display="flex"
        alignItems="flex-end"
        flexDirection="column"
        gap={1}
      >
        {imageComponent}
        {message.text ? (
          <ChatMessageContainerStyled
            ref={setElement}
            gap={1}
            mx={1.5}
            className={clsx(
              { [hoverMessageClassName]: isHover || isTablet },
            )}
            elevation={elevation}
          >
            {children}
          </ChatMessageContainerStyled>
        ) : null}
      </Box>
      {enableBranches ? (
        <MessagePagination
          disabled={isTyping}
          message={message}
          classes={messageActionsClasses}
        />
      ) : (
        <Box height={MessagePaginationHeight} />
      )}
    </Stack>
  );
};

export default ChatMessageUser;
