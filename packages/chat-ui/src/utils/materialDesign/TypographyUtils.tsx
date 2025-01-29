import { materialTheme, type MaterialThemeType, TypographyKeys } from './materialTheme';

type KeysName = Exclude<keyof MaterialThemeType, 'state'>;

export const extractTypographyText = (key: TypographyKeys) => {
  const path = key.split('.');
  const type = materialTheme[path[0] as KeysName];
  return type[path[1] as keyof typeof type];
}
