export const truncateString = (
  text: string,
  charsToKeep: number = 20,
  ellipsis: string = '...'
): string => {
  if (!text || text.length <= charsToKeep * 2) {
    return text;
  }

  const beginning = text.substring(0, charsToKeep);
  const ending = text.substring(text.length - charsToKeep);

  return `${beginning}${ellipsis}${ending}`;
};
