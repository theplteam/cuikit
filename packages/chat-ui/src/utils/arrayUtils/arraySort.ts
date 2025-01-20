export enum ArraySortingDirections {
  ASC, DESC
}

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: ArraySortingDirections = ArraySortingDirections.ASC
) => {
  return array.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === valB) return 0;

    const k = direction === ArraySortingDirections.ASC ? 1 : -1;

    return valA > valB ? 1*k : -1 * k;
  });
}

export const sortByDesc = <T>(array: T[], key: keyof T) => sortBy(array, key, ArraySortingDirections.DESC);
