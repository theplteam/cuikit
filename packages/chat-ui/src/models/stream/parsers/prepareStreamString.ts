export const prepareStreamString = (value: string) => {
  let result = value.trimStart();

  if (result.startsWith('data: ')) {
    result = result.substring(6);
  }

  result = result.trimEnd();

  return result;
}
