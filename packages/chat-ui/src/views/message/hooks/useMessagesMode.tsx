import * as React from 'react';

export enum MessageStateEnum {
  EDIT = 'edit',
  VIEW = 'view',
}

export const useMessagesMode = () => {
  const [messagesModeValues, setMessagesModeValues] = React.useState<{ [key: string]: MessageStateEnum }>({});

  const updateValue = (messageId: string, mode: MessageStateEnum) => {
    if (messagesModeValues[messageId] !== mode) {
      setMessagesModeValues(() => ({ ...messagesModeValues, [messageId]: mode }));
    }
  }

  const getState = (messageId: string) => {
    return messagesModeValues[messageId] ?? MessageStateEnum.VIEW;
  }

  return {
    values: messagesModeValues,
    updateValue: updateValue,
    edit: (messageId: string) => updateValue(messageId, MessageStateEnum.EDIT),
    view: (messageId: string) => updateValue(messageId, MessageStateEnum.VIEW),
    isView: (messageId: string)=> getState(messageId) === MessageStateEnum.VIEW,
    isEdit: (messageId: string)=> getState(messageId) === MessageStateEnum.EDIT,
  };
}

export type MessagesModeType = ReturnType<typeof useMessagesMode>;
