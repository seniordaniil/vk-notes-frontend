import React, { FC, Context, ReactElement, useState, useMemo } from 'react';
import { IValueContext } from '../../models/types';

interface ValueProviderProps {
  ctx: Context<IValueContext>;
}

export const ValueProvider: FC<ValueProviderProps> = ({ ctx, children }) => {
  const [state, setState] = useState(null);

  const value = useMemo(() => ({ value: state, setValue: setState }), [
    state,
    setState,
  ]);

  return (
    <ctx.Provider value={value}>
      {typeof children === 'function' ? children(state) : children}
    </ctx.Provider>
  );
};

const build = (
  children: ReactElement,
  deps: Context<IValueContext>[],
): ReactElement =>
  deps.length < 1 ? (
    children
  ) : (
    <ValueProvider ctx={deps[0]}>
      {build(children, deps.slice(1))}
    </ValueProvider>
  );

export const withValue: <P>(
  Component: FC<P>,
  deps: Context<IValueContext>[],
) => FC<P> = (Component, deps) => (props) =>
  build(<Component {...props} />, deps);
