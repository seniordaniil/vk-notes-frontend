import { useEffect, useRef } from 'react';

export const useTouchStop = (el: GlobalEventHandlers, capture?: boolean) => {
  useEffect(() => {
    if (el) {
      const listener = (e: Event) => {
        e.stopPropagation();
      };

      el.addEventListener('touchmove', listener, {
        capture,
      });

      return () => {
        el.removeEventListener('touchmove', listener, true);
      };
    }
  }, [el, capture]);
};

export function useTouchPrevent(el: GlobalEventHandlers, capture?: boolean) {
  useEffect(() => {
    if (el) {
      const listener = (e: Event) => {
        e.preventDefault();
      };

      el.addEventListener('touchmove', listener, {
        passive: false,
        capture,
      });

      return () => el.removeEventListener('touchmove', listener, true);
    }
  }, [el, capture]);
}

export const useScrollRestoration = (f?: boolean) => {
  const flag = useRef<boolean>(f);

  useEffect(() => {
    flag.current = f;

    if (f) {
      const listener = () => {
        if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      window.addEventListener('scroll', listener, {
        capture: true,
        once: true,
      });

      return () => window.removeEventListener('scroll', listener, true);
    }
  }, [f, flag]);

  useEffect(() => {
    const listener = () => {
      if (flag.current && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('touchend', listener, { capture: true });

    return () => window.removeEventListener('touchend', listener, true);
  }, [flag]);
};

type Deps = [GlobalEventHandlers, ...any[]];
type UseTouchEvent = 'touchstart' | 'touchend';

export const useTouch = (
  e: UseTouchEvent,
  onTouch: (e: TouchEvent) => void,
  deps: Deps,
) => {
  useEffect(() => {
    const el = deps[0];

    if (el) {
      const listener = (e: TouchEvent) => {
        e.preventDefault();
        onTouch(e);
      };

      el.addEventListener(e, listener, {
        passive: false,
        capture: true,
      });

      return () => {
        el.removeEventListener(e, listener, true);
      };
    }
    // eslint-disable-next-line
  }, deps);
};

export const useTouchClick = (onTouch: (e: TouchEvent) => void, deps: Deps) => {
  useEffect(() => {
    const el = deps[0];

    if (el) {
      let f = true;
      const endListener = (e: TouchEvent) => {
        if (f) {
          e.preventDefault();
          onTouch(e);
        } else {
          f = true;
        }
      };

      el.addEventListener('touchend', endListener, {
        passive: false,
      });

      const moveListener = (e: TouchEvent) => {
        f = false;
      };

      el.addEventListener('touchmove', moveListener, { capture: true });

      return () => {
        el.removeEventListener('touchend', endListener, true);
        el.removeEventListener('touchmove', moveListener, true);
      };
    }
    // eslint-disable-next-line
  }, deps);
};
