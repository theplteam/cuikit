import * as React from 'react';
import MessageContainer from './MessageContainer';
import { styled } from '@mui/material/styles';
import MessageMarkdownBlock from './markdown/MessageMarkdownBlock';
import { messageActionsClasses } from './messageActionsClasses';
import MessageActionsUser from './actions/MessageActionsUser';
import MessageUserEditor from './editor/MessageUserEditor';
import MessagePagination from './MessagePagination';
import { MessageStateEnum } from './hooks/useMessagesMode';
import Stack from '@mui/material/Stack';
import { useThreadContext } from '../thread/ThreadContext';
import { ChatMessageContentType, MessageModel, MessageUserContent } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useObserverValue } from '../hooks/useObserverValue';
import { useChatContext } from '../core/ChatGlobalContext';
import { useChatSlots } from '../core/ChatSlotsContext';
import { motion } from '../../utils/materialDesign/motion';
import { useElementRefState } from '../hooks/useElementRef';
import useHover from '../hooks/useHover';
import { useTablet } from '../../ui/Responsive';
import clsx from 'clsx';
import MessageAttachments from './attachments/MessageAttachments';
import { IdType } from '../../types';
import { chatClassNames } from '../core/chatClassNames';
import attachmentsStore from '../../models/AttachmentsStore';

type Props = {
  message: MessageModel;
  thread: ThreadModel;
  isFirst?: boolean;
  elevation?: boolean;
};

const {
  actionsClassName,
  paginationClassName,
  hoverMessageClassName,
} = messageActionsClasses;

const StackStyled = styled(Stack)(({ theme }) => ({
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

const MessageUser: React.FC<Props> = ({ message, thread, isFirst, elevation }) => {
  const { element, setElement } = useElementRefState();
  const isTablet = useTablet();
  const isTyping = useObserverValue(thread?.isTyping);
  const deletedIds = useObserverValue(message.attachments.deletedIds);
  const itemsAll = useObserverValue(message.attachments.itemsAll);

  const { messageMode, apiRef } = useThreadContext();
  const { onAssistantMessageTypingFinish, enableBranches } = useChatContext();
  const { slots, slotProps } = useChatSlots();

  const mode = messageMode.values[message.id];

  const isHover = useHover(element);

  const onClickEdit = () => {
    messageMode.edit(message.id);
  }

  const onClickApplyEdit = async (newText: string) => {
    messageMode.view(message.id);
    let content: MessageUserContent = newText;
    if (message.attachments) {
      const attachments = itemsAll?.filter((i) => !deletedIds?.includes(i.id)) || [];
      attachmentsStore.items = attachments;
      content = [{
        type: ChatMessageContentType.TEXT,
        text: newText,
      }, ...attachments.map((a) => a.contentData)];
    }
    const newMessage = await apiRef.current?.onEditMessage(content, message);
    if (newMessage) {
      message.attachments.deletedIds.value = [];
      apiRef.current?.handleChangeBranch(newMessage);
      onAssistantMessageTypingFinish?.({ message: message.data, thread: thread.data.data });
    }
  }

  const onClickCancelEdit = () => {
    messageMode.view(message.id);
    message.attachments.deletedIds.value = [];
  }

  const onDeleteAttachment = (id: IdType) => {
    message.attachments.deletedIds.value = [...deletedIds || [], id];
  }

  const textMessage = React.useMemo(() => message.text ? (
    <MessageContainer
      className={chatClassNames.messageUser}
      elevation={elevation}
      sx={{ width: '100%', backgroundColor: (theme) => theme.palette.grey[200] }}
    >
      <MessageMarkdownBlock
        text={message.text}
        rootComponent={slots.markdownMessageRoot}
        rootComponentProps={slotProps.markdownMessageRoot}
        inProgress={false}
      />
    </MessageContainer>
  ) : null, [message.text, slots.markdownMessageRoot]);

  const branchAction = React.useMemo(() => ((isFirst || message.parentId) && !!enableBranches) ? (
    <MessageActionsUser
      className={actionsClassName}
      disabled={isTyping}
      onClickEdit={onClickEdit}
    />
  ) : null, [message, isFirst, isTyping]);

  if (mode === MessageStateEnum.EDIT) {
    return (
      <Stack
        width="80%"
        gap={1}
        mx={1.5}
        alignItems="flex-end"
      >
        <MessageAttachments
          message={message}
          onDeleteAttachment={onDeleteAttachment}
        />
        <MessageUserEditor
          text={message.text}
          isAttachmentsChanged={!!deletedIds?.length}
          onClickApply={onClickApplyEdit}
          onClickCancel={onClickCancelEdit}
        />
      </Stack >
    );
  }

  return (
    <StackStyled
      ref={setElement}
      gap={1}
      alignItems='flex-end'
      position='relative'
      mx={1.5}
      className={
        clsx(
          { [hoverMessageClassName]: isHover || isTablet },
          chatClassNames.messageUserRoot,
        )
      }
      width={message.text ? '80%' : 'auto'}
      maxWidth="80%"
    >
      <MessageAttachments message={message} />
      {textMessage}
      {branchAction}
      {enableBranches ? (
        <MessagePagination
          disabled={isTyping}
          message={message}
          classes={messageActionsClasses}
        />
      ) : null}
    </StackStyled >
  );
};

export default MessageUser;
