export const arrayPluck = <T>(array: readonly T[] | (T[]), key: keyof T) => {
  return array.map(v => v[key]);
}
