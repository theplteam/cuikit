import * as React from 'react';
import { AdapterType } from './AdapterType';

const AdapterContext = React.createContext<AdapterType>({
  transformDialogue: (dialogue: any) => dialogue,
});

const useAdapterContext = () => {
  return React.useContext(AdapterContext);
};

export { AdapterContext, useAdapterContext };
