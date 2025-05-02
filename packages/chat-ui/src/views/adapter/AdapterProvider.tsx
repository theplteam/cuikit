import * as React from 'react';
import { AdapterType } from './AdapterType';
import { AdapterModel } from '../../models/AdapterModel';

export type AdapterProviderProps = React.PropsWithChildren<Partial<AdapterType>>;

export const AdapterProvider = ({ children, transformThread, transformMessage, reverseMessageTransforming }: AdapterProviderProps) => {

  const baseThreadTransformer = React.useCallback((thread: any) => {
    if (!!transformMessage && Array.isArray(thread.messages)) {
      return {
        ...thread,
        messages: thread.messages.map(transformMessage)
      };
    }

    return thread;
  }, [transformMessage]);

  const value = React.useMemo(
    () => ({
      transformThread: transformThread ?? baseThreadTransformer,
      transformMessage,
      reverseMessageTransforming,
    }),
    [transformThread, transformMessage, baseThreadTransformer, reverseMessageTransforming]
  );

  React.useMemo(() => {
    AdapterModel.transformThread = value.transformThread;
    AdapterModel.transformMessage = value.transformMessage;
    AdapterModel.reverseMessageTransforming = value.reverseMessageTransforming;
  }, [value]);

  return children;

  // We abandoned (perhaps temporarily) React Context because it created unnecessary renders and slowed down the chat
  /*return (
    <AdapterContext.Provider value={value}>
      {children}
    </AdapterContext.Provider>
  );*/
};
