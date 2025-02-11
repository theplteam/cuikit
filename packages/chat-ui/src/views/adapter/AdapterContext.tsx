import * as React from 'react';
import { AdapterType } from './AdapterType';

const AdapterContext = React.createContext<AdapterType | undefined>(undefined);

const useAdapterContext = () => {
  return React.useContext(AdapterContext);
};

export { AdapterContext, useAdapterContext };
