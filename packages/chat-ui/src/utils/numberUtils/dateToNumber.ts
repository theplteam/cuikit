import { Moment } from 'moment';

export const dateToNumber = (date: Moment | undefined, unitOfTime: 'days' = 'days') => {
  const day = date?.startOf('day');
  if (!day) return 0;
  let num = 1;
  switch (unitOfTime) {
    case 'days': num = 86400;
  }
  return Math.floor(day.unix() / num);
}

