export const arraySum  = (array: number[]) => {
  let result = 0;
  let index = -1;
  const length = array.length;

  while (++index < length) {
    const current = array[index];
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}
