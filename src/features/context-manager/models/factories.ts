import { createContext } from 'react';
import { IValueContext } from './types';

const emptyFn: () => void = () => undefined;

export const createValueContext = <T>(value?: T) =>
  createContext<IValueContext<T>>({
    value: value ?? null,
    setValue: emptyFn,
  });
