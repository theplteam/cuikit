import React from 'react';
import { SendMessageShortcut } from '../../types/SendMessageShortcut';
import { useSafeChatContext } from '../core/ChatGlobalContext';

type EvType<T extends HTMLElement> = React.KeyboardEvent<T>

export const DEFAULT_SEND_MESSAGE_SHORTCUT: SendMessageShortcut = 'enter';

export const isSendMessageShortcut = <T extends HTMLElement>(
  event: EvType<T>,
  shortcut: SendMessageShortcut = DEFAULT_SEND_MESSAGE_SHORTCUT,
): boolean => {
  const isEnter = event.key === 'Enter' || event.keyCode === 13;
  if (!isEnter) return false;

  // Enter that confirms an IME composition (CJK input) must not send the message
  if (event.nativeEvent.isComposing || event.keyCode === 229) return false;

  if (shortcut === 'ctrlEnter') {
    return event.ctrlKey || event.metaKey;
  }

  return !event.shiftKey;
};

const useSendMessageShortcut = (): SendMessageShortcut => {
  const { sendMessageShortcut } = useSafeChatContext();
  return sendMessageShortcut ?? DEFAULT_SEND_MESSAGE_SHORTCUT;
};

/**
 * Returns a `keyDown` handler that calls `fn` when the configured send shortcut is pressed
 * and prevents the key from inserting a new line.
 *
 * The decision is made on `keyDown` only: browsers on macOS do not dispatch `keyup` for
 * keys pressed while Cmd is held, and modifier state may differ between keydown and keyup.
 */
export const useSendShortcutKeyDown = <T extends HTMLElement>(fn: (event: EvType<T>) => void) => {
  const shortcut = useSendMessageShortcut();
  const fnRef = React.useRef(fn);
  fnRef.current = fn;

  return React.useCallback((event: EvType<T> | undefined) => {
    if (!event || !isSendMessageShortcut(event, shortcut)) return;

    event.preventDefault();
    event.stopPropagation();

    // Holding the key down auto-repeats keydown; send only once
    if (!event.repeat) {
      fnRef.current(event);
    }
  }, [shortcut]);
};

export default useSendShortcutKeyDown;
