const onlyUnique = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) === index;
}

export const arrayUnique = <T>(array: T[]): T[] => {
  return array.filter(onlyUnique);
}
