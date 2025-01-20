export const randomInt = (min: number, max: number) => {
  if (min > max) {
    throw new Error("The minimum value must be less than or equal to the maximum value.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomId = () => {
  return randomInt(1, 1000000);
}
