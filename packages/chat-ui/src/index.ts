import Chat from './views/Chat';
import ChatPage from './views/chatUi/ChatPage';
import ChatUi from './views/chatUi/ChatUi';
import ChatLicenseInfo from './views/utils/ChatLicenseInfo';
import { NewChatButton, NewChatIconButton, useChatContext } from './views';
import { useThreadContext } from './views/thread/ThreadContext';
import { useAssistantAnswerMock } from './views/core/useAssistantAnswerMock';
import { useChatApiRef } from './views/hooks/useChatApiRef';
import type { ApiRefType } from './views/core/useApiRef';
import { chatClassNames } from './views/core/chatClassNames';

export * from './models';
export * from './views/adapter';
// TODO: Hard fix
export * from './temporalExports';

type ChatApiRef = ApiRefType | null;

export {
  Chat,
  ChatPage,
  ChatUi,
  NewChatButton,
  NewChatIconButton,
  useChatContext,
  useThreadContext,
  ChatLicenseInfo,
  useAssistantAnswerMock,
  useChatApiRef,
  type ChatApiRef,
  chatClassNames,
};
