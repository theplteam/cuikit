import * as React from 'react';
import { AdapterType } from './AdapterType';
import { MessageModel } from '../../models';

const AdapterContext = React.createContext<AdapterType>({
  transformThread: (thread: any) => thread,
});

const useAdapterContext = () => {
  return React.useContext(AdapterContext);
};

/**
 * A custom hook that provides a function to reverse transform a message using the
 * `reverseMessageTransforming` function from the adapter context.
 *
 * The returned callback function takes a message model as input and applies the
 * reverse transformation to the `data` property of the message if the
 * `reverseMessageTransforming` function is available in the adapter context.
 * If not, it returns the `data` property of the message as-is.
 *
 */
export const useInternalMessageTransformer = () => {
  const { reverseMessageTransforming } = useAdapterContext();

  return  React.useCallback((message: MessageModel) => {
    return reverseMessageTransforming?.(message.data) ?? message.data;
  }, [reverseMessageTransforming]);
};

export { AdapterContext, useAdapterContext };
