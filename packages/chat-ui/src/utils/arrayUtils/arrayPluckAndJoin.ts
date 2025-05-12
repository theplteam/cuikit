import { arrayPluck } from './arrayPluck';

export const arrayPluckAndJoin = <T>(array: readonly T[] | (T[]), key: keyof T, separator: string = ''): string => {
  return arrayPluck(array, key).join(separator);
}
