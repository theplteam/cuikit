import * as React from 'react';
import { CHAT_LOCALE } from '../../locale/enEN';
import { Localization } from '../../locale/Localization';

export const useLocalizationInit = (): Localization => {
  return React.useMemo(() => ({
    ...CHAT_LOCALE,
  }), []);
}
