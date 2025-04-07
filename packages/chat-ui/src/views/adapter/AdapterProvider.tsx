import * as React from 'react';
import { AdapterType } from './AdapterType';
import { AdapterContext } from './AdapterContext';

export type AdapterProviderProps = React.PropsWithChildren<Partial<AdapterType>>;

export const AdapterProvider = ({ children, transformThread, transformMessage }: AdapterProviderProps) => {

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
    () => ({ transformThread: transformThread ?? baseThreadTransformer, transformMessage }),
    [transformThread, transformMessage, baseThreadTransformer]
  );

  return (
    <AdapterContext.Provider value={value}>
      {children}
    </AdapterContext.Provider>
  );
};
