import React, { FC, useState, useCallback, useMemo } from 'react';
import { HistoryContext, History } from '../../models/types';

interface HistoryProps<Data = any> {
  onClose: () => void;
  ctx: HistoryContext<Data>;
  initial: Data;
}

export const HistoryProvider: FC<HistoryProps> = ({
  initial,
  onClose,
  children,
  ctx,
}) => {
  const [history, setHistory] = useState<any[]>([initial]);

  const push = useCallback(
    (data: any) => {
      setHistory((state) => [...state, data]);
    },
    [setHistory],
  );

  const goBack = useCallback(() => {
    if (history.length <= 1) onClose();
    else setHistory((state) => state.slice(0, state.length - 1));
  }, [setHistory, history, onClose]);

  const replace = useCallback(
    (dispatch: (data: any) => any) => {
      setHistory((state) => [
        ...state.slice(0, state.length - 1),
        dispatch(state[state.length - 1]),
      ]);
    },
    [setHistory],
  );

  const value = useMemo<History>(
    () => ({
      history,
      push,
      goBack,
      replace,
      close: onClose,
    }),
    [history, push, goBack, onClose, replace],
  );

  return <ctx.Provider value={value}>{children}</ctx.Provider>;
};

type ComponentProps<P> = Omit<P, keyof HistoryProps>;

type HistoryHOCProps<P, Data> = ComponentProps<P> &
  Omit<HistoryProps<Data>, 'ctx'>;

export const withHistory: <P, Data>(
  ctx: HistoryContext<Data>,
  Component: FC<ComponentProps<P>>,
) => FC<HistoryHOCProps<P, Data>> = (ctx, Component) => ({
  initial,
  onClose,
  ...props
}) => (
  <HistoryProvider initial={initial} onClose={onClose} ctx={ctx}>
    <Component {...(props as any)} />
  </HistoryProvider>
);
