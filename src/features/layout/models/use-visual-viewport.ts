import { useEffect, useState } from 'react';

export function useVisualViewPort(
  onResize: (e: Event) => void,
  deps: any[],
): number;
export function useVisualViewPort(): number;
export function useVisualViewPort(onResize?: (e: Event) => void, deps?: any[]) {
  const [height, setHeight] = useState<number>(
    // @ts-ignore
    window.visualViewport?.height || window.innerHeight,
  );

  useEffect(() => {
    const listener = (e: Event) => {
      // @ts-ignore
      setHeight(window.visualViewport?.height || window.innerHeight);

      onResize?.(e);
    };
    // @ts-ignore
    window.visualViewport?.addEventListener('resize', listener);
    // @ts-ignore
    return () => window.visualViewport?.removeEventListener('resize', listener);
    // eslint-disable-next-line
  }, deps || []);

  return height;
}
