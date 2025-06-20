import * as React from 'react';
import { HistoryContextType } from './HistoryType';

const Context = React.createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children, ...props }: React.PropsWithChildren<HistoryContextType>) => {
  const value = React.useMemo(() => props, [props.loading])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export const useHistoryContext = () => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  }

  return context;
};
