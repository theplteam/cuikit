import { Localization } from '../../locale/Localization';
import * as React from 'react';
import { useLocalizationInit } from './useLocalizationInit';

type LocalizationType = Localization;

type Props = React.PropsWithChildren<{ locale?: string }>;

const Context = React.createContext<LocalizationType | undefined>(undefined);

const LocalizationProvider = ({children, locale}: Props) => {
  const value = useLocalizationInit(locale);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const useLocalizationContext = (): LocalizationType => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("useLocalizationContext must be used within a LocalizationProvider");
  }

  return context;
};

export { LocalizationProvider, useLocalizationContext };
