import { useMemo } from 'react';
import { useHistory } from 'features/history-manager';
import { ModalHistoryContext } from '../utils/private';

export const useModal = <P = {}>() => {
  const { current, ...data } = useHistory(ModalHistoryContext);

  const current$ = useMemo(
    () => ({ ...current, params: ((current?.params || {}) as unknown) as P }),
    [current],
  );

  return {
    ...current$,
    ...data,
  };
};
