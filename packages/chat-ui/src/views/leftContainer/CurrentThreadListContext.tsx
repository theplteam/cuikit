import * as React from 'react';
import { ThreadModel } from '../../models';

type CurrentThreadListType = {
  currentThread: ThreadModel | undefined;
};

type Props = React.PropsWithChildren<{
  currentThread: ThreadModel | undefined;
}>;

const Context = React.createContext<CurrentThreadListType | undefined>(undefined);

const CurrentThreadListProvider = ({ children, currentThread }: Props) => {
  const value = React.useMemo(() => ({ currentThread }), [currentThread]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useCurrentThreadListContext = (): CurrentThreadListType => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useCurrentThreadListContext must be used within a CurrentThreadListProvider");
  }

  return context;
};

export { CurrentThreadListProvider, useCurrentThreadListContext };
