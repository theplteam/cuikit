import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToolsSelect from './tools/ToolsSelect';
import { ThreadModel } from '../../models/ThreadModel';
import SendMessageButton from './SendMessageButton';
import FileAttachmentBlock from './attachments/FileAttachmentBlock';
import { FileAttachmentConfig } from './attachments/useFileAttachment';
import { useChatSlots } from '../core/ChatSlotsContext';

type Props = {
  thread?: ThreadModel;
  isTyping?: boolean;

  attachmentConfig: FileAttachmentConfig,

  onSendMessage: () => void;
  disabledSendMessage?: boolean;
};

const RowInnerFooter: React.FC<Props> = ({ attachmentConfig, onSendMessage, thread, isTyping, disabledSendMessage }) => {
  const { slots } = useChatSlots();

  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Stack direction='row' alignItems='center'>
        <FileAttachmentBlock
          attachmentConfig={attachmentConfig}
          isTyping={isTyping}
        />
        <ToolsSelect thread={thread} isTyping={isTyping} />
        <slots.formActions isTyping={isTyping} thread={thread} />
      </Stack>
      <SendMessageButton
        disabled={disabledSendMessage}
        isTyping={isTyping}
        onSendMessage={onSendMessage}
      />
    </Stack>
  );
};

export default RowInnerFooter;
