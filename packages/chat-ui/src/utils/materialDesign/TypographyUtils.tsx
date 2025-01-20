import { type MaterialThemeType, TypographyKeys } from './materialTheme';
import { type Theme } from '@mui/material/styles';

type KeysName = Exclude<keyof MaterialThemeType, 'state'>;

export const extractTypographyText = (theme: Theme, key: TypographyKeys) => {
  const path = key.split('.');
  const type = theme.m3.materialTheme[path[0] as KeysName];
  return type[path[1] as keyof typeof type];
}
