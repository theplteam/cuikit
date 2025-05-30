import * as React from 'react';
import { ThreadModel } from '../../../models/ThreadModel';
import { MessageModel } from '../../../models/MessageModel';

export type StateType = {
  element: HTMLDivElement;
  thread: ThreadModel;
  message: MessageModel;
};

export type MobileMessageActionsType = {
  selectedValue?: {
    thread: ThreadModel;
    message: MessageModel;
    top: number;
    left: number;
    bottom: number;
    getBoundingClientRect: () => DOMRect;
  };
  handleSelectMessage: (thread: ThreadModel, message: MessageModel, element: HTMLDivElement) => void,
  handleCloseSelection: () => void,
};

export const useMobileMessageActions = (): MobileMessageActionsType => {
  const [_selectedValue, setSelectedValue] = React.useState<StateType | undefined>();

  const handleSelectMessage = (thread: ThreadModel, message: MessageModel, element: HTMLDivElement) => {
    setSelectedValue({ element, thread, message });
  }

  const handleCloseSelection = () => {
    setSelectedValue(undefined);
  }

  const selectedValue: MobileMessageActionsType['selectedValue'] = React.useMemo(() => {
    if (!_selectedValue || !_selectedValue.element.parentElement?.parentElement) return undefined;

    const bounds = _selectedValue.element.getBoundingClientRect();
    const parent = _selectedValue.element.parentElement.parentElement;
    const parentBounds = parent.getBoundingClientRect();

    const top = bounds.top - parentBounds.top + (parseInt(parent.style.paddingTop) || 0);
    const bottom = top + bounds.height;

    return {
      message: _selectedValue.message,
      thread: _selectedValue.thread,
      top,
      bottom,
      left: bounds.left - parentBounds.left,
      getBoundingClientRect: () => _selectedValue.element.getBoundingClientRect(),
    };
  }, [_selectedValue]);

  return {
    selectedValue,
    handleSelectMessage,
    handleCloseSelection,
  };
}
