import React from 'react';

type EvType<T extends HTMLElement> = React.KeyboardEvent<T>

export const useEnterPress = <T extends HTMLElement>(fn: (event: EvType<T>) => void) => (event: EvType<T> | undefined) => {
  if (event && (event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) {
    fn(event);
    event.preventDefault();
    event.stopPropagation();
  }
};

export const handleIgnoreEnterPress =  <T extends HTMLElement>(event: EvType<T> | undefined) => {
  if (event && (event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export default useEnterPress;
