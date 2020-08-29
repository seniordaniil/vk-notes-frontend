import { useContext, Context, useEffect } from 'react';
import { IValueContext, ValueDispatch } from './types';

export const useValue = <T>(
  ctx: Context<IValueContext<T>>
): [T, ValueDispatch<T>] => {
  const value = useContext(ctx);
  return [value.value, value.setValue];
};

type ValueEffect<T> = (setState: ValueDispatch<T>) => void | (() => void);

export const useValueEffect = <T>(
  effect: ValueEffect<T>,
  deps: [Context<IValueContext<T>>, ...any[]]
) => {
  const [value$, ...deps$] = deps;
  const [, setValue] = useValue(value$);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => effect(setValue), [setValue, ...deps$]);
  /* eslint-enable react-hooks/exhaustive-deps */
};
