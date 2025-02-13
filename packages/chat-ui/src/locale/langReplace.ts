export const langReplace = (text: string, replace: Record<string, string | number>) => {
  if (text && replace) {
    for (const key in replace) {
      const value = replace[key]?.toString() ?? '';
      text = text.replace(`{{${key}}}`, value);
    }
  }

  return text;
}
