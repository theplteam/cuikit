import * as React from 'react';
import { ChatApp, LangKeys } from '../models/ChatApp';

export const useLangInit = (lang: LangKeys | undefined) => {
  React.useMemo(() => {
    if (lang) {
      ChatApp.setLang(lang);
    }
  }, []);
}
