import * as React from 'react';
import { CHAT_LOCALE } from '../../locale/enEN';
import { ruRU } from '../../locale/ruRU';
import { LangKeys, Localization } from '../../locale/Localization';
import { zhCN } from '../../locale/zhCN';
import { koKR } from '../../locale/koKR';
import { jaJP } from '../../locale/jaJP';

export const useLocalizationInit = (locale?: LangKeys): Localization => {
  return React.useMemo(() => {
    let localization = CHAT_LOCALE;

    switch (locale) {
      case 'ruRU': localization = ruRU;break;
      case 'ru': localization = ruRU;break;
      case 'zhCN': localization = zhCN;break;
      case 'zh': localization = zhCN;break;
      case 'koKR': localization = koKR;break;
      case 'ko': localization = koKR;break;
      case 'jaJP': localization = jaJP;break;
      case 'ja': localization = jaJP;break;
    }

    return localization;
  }, [locale]);
}
