import * as React from 'react';
import { IdType } from '../../../types';

export enum MessageStateEnum {
  EDIT = 'edit',
  VIEW = 'view',
}

export const useMessagesMode = () => {
  const [messagesModeValues, setMessagesModeValues] = React.useState<{ [key: string]: MessageStateEnum }>({});

  const updateValue = (messageId: IdType, mode: MessageStateEnum) => {
    if (messagesModeValues[messageId] !== mode) {
      setMessagesModeValues(() => ({ ...messagesModeValues, [messageId]: mode }));
    }
  }

  const getState = (messageId: IdType) => {
    return messagesModeValues[messageId] ?? MessageStateEnum.VIEW;
  }

  return {
    values: messagesModeValues,
    updateValue: updateValue,
    edit: (messageId: IdType) => updateValue(messageId, MessageStateEnum.EDIT),
    view: (messageId: IdType) => updateValue(messageId, MessageStateEnum.VIEW),
    isView: (messageId: IdType)=> getState(messageId) === MessageStateEnum.VIEW,
    isEdit: (messageId: IdType)=> getState(messageId) === MessageStateEnum.EDIT,
  };
}

export type MessagesModeType = ReturnType<typeof useMessagesMode>;
