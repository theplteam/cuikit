import * as React from 'react';
import { ChatDialogue } from '../../../models/ChatDialogue';
import { ChatMessage } from '../../../models/ChatMessage';

export type StateType = {
  element: HTMLDivElement;
  dialogue: ChatDialogue;
  message: ChatMessage;
};

export type MobileMessageActionsType = {
  selectedValue?: {
    dialogue: ChatDialogue;
    message: ChatMessage;
    top: number;
    left: number;
    bottom: number;
    getBoundingClientRect: () => DOMRect;
  };
  handleSelectMessage: (dialogue: ChatDialogue, message: ChatMessage, element: HTMLDivElement) => void,
  handleCloseSelection: () => void,
};

export const useMobileMessageActions = (): MobileMessageActionsType => {
  const [_selectedValue, setSelectedValue] = React.useState<StateType | undefined>();

  const handleSelectMessage = (dialogue: ChatDialogue, message: ChatMessage, element: HTMLDivElement) => {
    setSelectedValue({ element, dialogue, message });
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
      dialogue: _selectedValue.dialogue,
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
