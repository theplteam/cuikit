export type LangReplaceType = Record<string, string | number>;

/**
 * @deprecated
 * use Localization instead
 * @see Localization
 * @see useLocalizationContext
 */
export const lng = (array: string[], replace?: LangReplaceType) => {
  let text = array[0] ?? '';
  if (text && replace) {
    for (const key in replace) {
      const value = replace[key]?.toString() ?? '';
      text = text.replace(`{{${key}}}`, value);
    }
  }
  return text;
};
