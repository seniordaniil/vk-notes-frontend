import { useContext, useMemo } from 'react';
import { HistoryContext } from './types';

export const useHistory = <Data>(ctx: HistoryContext<Data>) => {
  const { history, ...data } = useContext(ctx);

  const current = useMemo(() => history[history.length - 1], [history]);

  return {
    current,
    ...data,
  };
};
