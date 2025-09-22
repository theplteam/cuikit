import * as React from 'react';
import ChatTextField from './ChatTextField';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadModel } from '../../models/ThreadModel';
import { useChatContext } from '../core/ChatGlobalContext';
import { Message } from '../../models';
import AttachmentsPreview from './preview/AttachmentsPreview';
import attachmentsStore from '../../models/AttachmentsStore';
import RowInnerFooter from './RowInnerFooter';
import SendMessageButton from './SendMessageButton';
import useFileAttachment from './attachments/useFileAttachment';

type Props = {
  thread?: ThreadModel;
};

const ChatTextFieldRowInner: React.FC<Props> = ({ thread }) => {
  const { defaultTextFieldValue, apiRef, enableFileAttachments, toolsList } = useChatContext();

  const isTyping = useObserverValue(thread?.isTyping);
  const isLoadingAttachments = useObserverValue(thread?.isLoadingAttachments);
  const isLoadingFullData = useObserverValue(thread?.isLoadingFullData);

  const attachmentConfig = useFileAttachment();
  const { attachments, setAttachments, handleFileUpload } = attachmentConfig;

  const [text, setText] = React.useState(defaultTextFieldValue ?? '');
  const [expand, setExpand] = React.useState(false);

  const onSendMessage = () => {
    if (isLoadingAttachments?.length) return;
    setExpand(false);
    let content: Message['content'] = text;
    if (attachments.length) {
      attachmentsStore.items.push(...attachments.filter((a) => !a.error.value));
      content = attachments.map((a) => a.contentData);
      if (text) {
        content = [
          { type: 'text', text },
          ...content,
        ];
      }
    };

    apiRef.current?.sendUserMessage(content);
    setText('');

    setAttachments([]);
  };

  const controlsInFooter = enableFileAttachments || !!toolsList?.length;
  const disabledTextField = !thread || isTyping || isLoadingFullData;
  const disabledButton = (!isTyping && !text && !attachments.length) || !!isLoadingAttachments?.length || isLoadingFullData;

  const previewComponent = React.useMemo(() => (
    <AttachmentsPreview attachments={attachments} setAttachments={setAttachments} thread={thread} />
  ), [attachments, thread]);

  return (
    <>
      {previewComponent}
      <ChatTextField
        text={text}
        setText={setText}
        expand={expand}
        setExpand={setExpand}
        disabled={disabledTextField}
        handleFileUpload={handleFileUpload}
        onSendMessage={onSendMessage}
      />
      {controlsInFooter
        ? (
          <RowInnerFooter
            thread={thread}
            attachmentConfig={attachmentConfig}
            isTyping={isTyping}
            disabledSendMessage={disabledButton}
            onSendMessage={onSendMessage}
          />
        ) : (
          <SendMessageButton
            disabled={disabledButton}
            isTyping={isTyping}
            onSendMessage={onSendMessage}
          />
        )}
    </>
  );
};

export default ChatTextFieldRowInner;
