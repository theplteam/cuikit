import * as React from 'react';
import { CHAT_LOCALE } from '../../locale/enEN';
import { ruRU } from '../../locale/ruRU';
import { Localization } from '../../locale/Localization';

export const useLocalizationInit = (locale?: string): Localization => {
  return React.useMemo(() => {

    return ({
      ...(locale === 'ru' ? ruRU : CHAT_LOCALE),
    });
  }, [locale]);
}
