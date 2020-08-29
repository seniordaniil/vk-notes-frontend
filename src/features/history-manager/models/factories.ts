import { createContext } from 'react';
import { History } from './types';

const emptyFn: () => void = () => undefined;

export const createHistoryContext = <Data>() =>
  createContext<History<Data>>({
    history: [],
    push: emptyFn,
    replace: emptyFn,
    goBack: emptyFn,
    close: emptyFn,
  });
