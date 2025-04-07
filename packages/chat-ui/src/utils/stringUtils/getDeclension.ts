import { lng } from '../lng';

export const getDeclension = (int: number, nouns: [one: string, two: string, five: string], insertNumFirst?: boolean) => {
  const [one, two, five] = nouns;
  let n = Math.abs(int);
  n %= 100;
  let res: string | undefined;
  if (n >= 5 && n <= 20) {
    res = five;
  }
  n %= 10;
  if (!res && n === 1) {
    res = one;
  }
  if (!res && n >= 2 && n <= 4) {
    res = two;
  }
  if (!res) res = five;

  return insertNumFirst ? `${int} ${res}` : res;
}

type LangArray = [string,string,string];
export const getLangDeclension = (int: number, langArray: [LangArray,LangArray], replaceKey?: string) => {
  return lng(
    [
      getDeclension(int, langArray[0]),
      getDeclension(int, langArray[1])
    ],
    replaceKey ? {
      [replaceKey]: int,
    } : undefined
  );
}

export const getDaysText = (daysCount: number) => {
  return lng(
    [
      getDeclension(daysCount, [`${daysCount} день`, `${daysCount} дня`, `${daysCount} дней`]),
      getDeclension(daysCount, [`${daysCount} day`, `${daysCount} days`, `${daysCount} days`])]
  );
}
