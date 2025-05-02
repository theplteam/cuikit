import * as React from 'react';
import { AdapterType } from './AdapterType';
import { MessageModel } from '../../models';
import { AdapterModel } from '../../models/AdapterModel';

/**
 * @deprecated - We abandoned (perhaps temporarily) React Context because it created unnecessary renders and slowed down the chat
 */
const AdapterContext = React.createContext<AdapterType>({
  transformThread: (thread: any) => thread,
});

const useAdapterContext = (): Partial<AdapterType> => {
  return React.useMemo(() => ({
    transformThread: AdapterModel.transformThread,
    transformMessage: AdapterModel.transformMessage,
    reverseMessageTransforming: AdapterModel.reverseMessageTransforming,
  }), [AdapterModel.version]);
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
