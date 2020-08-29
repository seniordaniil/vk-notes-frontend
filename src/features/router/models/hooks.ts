import { useContext, useMemo, useCallback, useEffect } from 'react';
import { useRoute } from 'react-router5';
import { useStoreMap, useStore, useEvent } from 'effector-react';
import { $history, $canNavigate, setCanNavigate } from './store';
import { RouteContext } from '../utils/private';
import { goBack } from '../utils/public';

export const useLocation = <P = Record<string, any>>() => {
  const { isCurrent, depth } = useContext(RouteContext);
  const { router, route, previousRoute, ...data } = useRoute();
  const historyLength = useStoreMap({
    store: $history,
    keys: [],
    fn: (state) => state.length,
  });

  const { path, params } = useMemo(
    () => ({
      path:
        (isCurrent ? route : previousRoute)?.name.split('.').slice(0, depth) ||
        [],
      params: ((isCurrent ? route : previousRoute)?.params || {}) as P,
    }),
    [isCurrent, route, previousRoute, depth],
  );

  const _goBack = useCallback(
    (fb?: () => void, delta = -1) => {
      if (historyLength > Math.abs(delta)) goBack(delta);
      else if (fb) fb();
      else router.navigateToDefault({ replace: true });
    },
    [router, historyLength],
  );

  const pathSplice = useCallback(
    (pathName: string, slice?: number) =>
      path.slice(0, slice).concat(pathName).join('.'),
    [path],
  );

  return {
    path,
    pathSplice,
    params,
    route,
    router,
    previousRoute,
    goBack: _goBack,
    ...data,
  };
};

export const useCanNavigate = (
  state?: boolean,
  recoverState?: boolean,
): [boolean, (state: boolean) => void] => {
  const canNavigate = useStore($canNavigate);
  const setCanNavigateFn = useEvent(setCanNavigate);

  useEffect(() => {
    if (typeof state === 'boolean') setCanNavigate(state);
    if (typeof recoverState === 'boolean')
      return () => setCanNavigate(recoverState);
  }, [state, recoverState, setCanNavigateFn]);

  return [canNavigate, setCanNavigateFn];
};
