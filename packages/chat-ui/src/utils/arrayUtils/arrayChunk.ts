export const arrayChunk = <T>(array: T[], size: number | (() => number)) => {
  const length = array == null ? 0 : array.length;
  if (!length || (typeof size === 'number' && size < 1)) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  let result: T[][] = [];

  while (index < length) {
    let sizeNow = typeof size === 'number' ? size : size();
    result[resIndex++] = baseSlice(array, index, (index += sizeNow));
  }
  return result;
}

const baseSlice = <T>(array: T[], start: number, end: number) => {
  let index = -1,
    length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  let result: T[] = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
