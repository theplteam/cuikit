import { ChatApp, LangKeys } from '../models/ChatApp';

export type LangReplaceType = Record<string, string | number>;

export const lng = (array: string[], replace?: LangReplaceType) => {
  let text = (ChatApp.lang === LangKeys.RU ? array[0] : array[1]) ?? '';
  if (text && replace) {
    for (const key in replace) {
      const value = replace[key]?.toString() ?? '';
      text = text.replace(`{{${key}}}`, value);
    }
  }
  return text;
};
