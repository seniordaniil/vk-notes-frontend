import { Dispatch, SetStateAction } from 'react';

export type ValueDispatch<T> = Dispatch<SetStateAction<T>>;

export interface IValueContext<T = any> {
  value: T;
  setValue: ValueDispatch<T>;
}
