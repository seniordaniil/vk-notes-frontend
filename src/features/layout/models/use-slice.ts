import {
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';

type FetchMore = () => void;
type Deps<T> = [number, T[], ...any[]];

export const useSlice = <T>(
  cb: FetchMore,
  [part, data, ...deps]: Deps<T>,
): [
  T[],
  {
    next: FetchMore;
    refresh: FetchMore;
    count: number;
    setCount: Dispatch<SetStateAction<number>>;
  },
] => {
  const [count, setCount] = useState(part);

  const next = useCallback(() => {
    const nextCount = count + part;
    if (data?.length < nextCount) {
      try {
        cb();
      } catch (e) {}
    }
    setCount(nextCount);
    // eslint-disable-next-line
  }, [count, part, data, ...deps]);

  const slicedData = useMemo(() => data?.slice(0, count), [data, count]);

  const refresh = useCallback(() => setCount(part), [part]);

  return [
    slicedData,
    {
      next,
      refresh,
      count,
      setCount,
    },
  ];
};
