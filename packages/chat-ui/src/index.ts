import Chat from './views/Chat';
import ChatPage from './views/chatUi/ChatPage';
import ChatUi from './views/chatUi/ChatUi';
import ChatLicenseInfo from './views/utils/ChatLicenseInfo';
import { NewChatButton, NewChatIconButton, useChatContext } from './views';
import { useDialogueContext } from './views/dialogue/DialogueContext';
import { useAssistantAnswerMock } from './views/core/useAssistantAnswerMock';
import { useChatApiRef } from './views/hooks/useChatApiRef';

export * from './models';
export * from './views/adapter';

export {
  Chat,
  ChatPage,
  ChatUi,
  NewChatButton,
  NewChatIconButton,
  useChatContext,
  useDialogueContext,
  ChatLicenseInfo,
  useAssistantAnswerMock,
  useChatApiRef,
};
