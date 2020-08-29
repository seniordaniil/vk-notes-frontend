import { useMemo } from 'react';
import { format, isSameDay, isSameWeek } from 'date-fns';
import ru from 'date-fns/locale/ru';

export const tsFormat = (ts: string) => {
  const date = new Date(ts);
  const now = new Date();
  let f: string;
  if (isSameDay(date, now)) f = 'p';
  else if (isSameWeek(date, now)) f = 'iiiiii p';
  else f = 'PPp';

  return format(date, f, { locale: ru });
};

export const useTs = (ts: string) => {
  return useMemo(() => tsFormat(ts), [ts]);
};
