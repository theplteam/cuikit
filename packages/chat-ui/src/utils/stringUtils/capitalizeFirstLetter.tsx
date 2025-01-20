export const capitalizeFirstLetter = (str: string) => {
  return typeof str === 'string'
    ? str[0].toUpperCase() + str.slice(1)
    : str;
}
