export const chatClassNames = {
  threadRoot: 'chat-ui-thread-root',
  threadRootContainer: 'chat-ui-thread-root-container',
  textFieldRoot: 'chat-ui-textfield-root',
  messageRoot: 'chat-ui-message-root',
  messageReasoningRoot: 'chat-ui-message-reasoning-root',
  messageAssistantRoot: 'chat-ui-message-assistant-root',
  messageUserRoot: 'chat-ui-message-user-root',
  messageUser: 'chat-ui-message-user',
  messageNavRail: 'chat-ui-message-nav-rail',
  messageNavList: 'chat-ui-message-nav-list',
  messageNavListButton: 'chat-ui-message-nav-list-button',
  markdownParentRoot: 'chat-ui-markdown-parent-root',
  markdownImage: 'chat-ui-markdown-image',
  markdownSmoothedPending: 'chat-ui-markdown-smooth-pending',
  markdownSmoothedAnimating: 'chat-ui-markdown-smooth-animating',
};

/**
 * Custom properties the host app may set on any ancestor of the chat to tune behaviour
 * that depends on the surrounding page rather than on the chat itself.
 */
export const chatCssVariables = {
  /**
   * Gap kept above a message that is scrolled to (nav rail, Shift+Arrow,
   * `apiRef.current.scrollToMessage`). Defaults to 24px; raise it by the height of a
   * sticky header of your own so the target does not land underneath it, e.g.
   * `--chat-ui-message-scroll-margin-top: 88px`.
   */
  messageScrollMarginTop: '--chat-ui-message-scroll-margin-top',
};
