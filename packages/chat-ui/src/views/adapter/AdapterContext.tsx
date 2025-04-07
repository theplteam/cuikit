import * as React from 'react';
import { AdapterType } from './AdapterType';

const AdapterContext = React.createContext<AdapterType>({
  transformThread: (thread: any) => thread,
});

const useAdapterContext = () => {
  return React.useContext(AdapterContext);
};

export { AdapterContext, useAdapterContext };
