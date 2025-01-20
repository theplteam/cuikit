// Костыльная замена мобксу. Использовать не нужно
export const mutationPromise = <T extends number | string>(
  getValue: () => T,
) => {
  const startValue = getValue();

  return new Promise((resolve) => {
    mutationTimeoutRecursive(() => getValue() !== startValue, resolve);
  });
}

const mutationTimeoutRecursive = (condition: () => boolean, callback: (value: boolean) => void, iteration = 0) => {
  setTimeout(() => {
    if (condition() || iteration > 50) callback(true);
    else mutationTimeoutRecursive(condition, callback, iteration + 1);
  }, 10);
}
