import * as React from 'react';
import { AdapterType } from './AdapterType';
import { AdapterContext } from './AdapterContext';

type Props = React.PropsWithChildren<AdapterType>;

export const AdapterProvider = ({ children, transformDialogue, transformMessage }: Props) => {

  const value = React.useMemo(
    () => ({ transformDialogue, transformMessage }),
    [transformDialogue, transformMessage]
  );

  return (
    <AdapterContext.Provider value={value}>
      {children}
    </AdapterContext.Provider>
  );
};
