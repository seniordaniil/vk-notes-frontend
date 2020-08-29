import { Context } from 'react';

export interface History<Data = any> {
  history: Data[];
  push: (data: Data) => void;
  replace: (dispatch: (state: Data) => Data) => void;
  goBack: () => void;
  close: () => void;
}

export type HistoryContext<Data = any> = Context<History<Data>>;
