import * as React from 'react';
import { ThreadListContextType } from './ThreadListType';

const Context = React.createContext<ThreadListContextType | undefined>(undefined);

export const ThreadListProvider = ({ children, ...props }: React.PropsWithChildren<ThreadListContextType>) => {
  const value = React.useMemo(() => props, [props.loading])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export const useThreadListContext = () => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useThreadListContext must be used within a ThreadListProvider");
  }

  return context;
};
