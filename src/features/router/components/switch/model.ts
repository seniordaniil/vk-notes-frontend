import React, { useContext, useMemo, useCallback } from 'react';
import { useRoute } from 'react-router5';
import { Router } from 'router5';
import { useStoreMap } from 'effector-react';
import { $history } from '../../models/store';
import { RouteContext, IRouteContext } from '../../utils/private';

interface Path {
  current: string[];
  previous: string[];
}

export const useData = (id: string) => {
  const { depth, isCurrent } = useContext(RouteContext);
  const { route, previousRoute, router } = useRoute();

  const path = useMemo<Path>(
    () => ({
      current: route?.name.split('.') || [],
      previous: previousRoute?.name.split('.') || [],
    }),
    [route, previousRoute],
  );

  const { current, previous, active } = useMemo(
    () => ({
      current: path.current[depth],
      previous: path.previous[depth],
      active: depth === 0 ? undefined : path.current[depth - 1],
    }),
    [path, depth],
  );

  const value = useMemo<IRouteContext>(
    () => ({
      depth: depth + 1,
      isCurrent: isCurrent && active === id,
    }),
    [depth, active, isCurrent, id],
  );

  return {
    value,
    active: value.isCurrent ? current : previous,
    router,
    path,
    isCurrent,
  };
};

export const useHistory = (id: string, value: IRouteContext, mode: boolean) => {
  return useStoreMap({
    store: $history,
    keys: [id, value, mode],
    fn: (state, [id, value, mode]) => {
      const depth = value.depth - 1;
      if (!mode) return null;
      if (!value.isCurrent) return [];
      const ids: string[] = [];

      for (let i = state.length - 1; i >= 0; i--) {
        const path = state[i]?.split('.');
        if (depth !== 0 && path[depth - 1] !== id) break;
        ids.unshift(path[depth]);
      }

      return ids;
    },
  });
};

export type Navigate = Router['navigate'];

export const useEpicNavigation = (
  router: Router,
  path: Path,
  isCurrent: boolean,
  depth: number,
  active: string,
) => {
  const navigate = useCallback<Navigate>(
    (routeName: string, ...args: any[]) =>
      router.navigate(
        [
          ...(isCurrent ? path.current : path.previous).slice(0, depth),
          routeName,
        ].join('.'),
        ...args,
      ),
    [router, path, isCurrent, depth],
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      navigate(e.currentTarget.dataset.story, null, { replace: true });
    },
    [navigate],
  );

  const receiveProps = useCallback(
    (id: string) => ({
      'data-story': id,
      onClick,
      selected: id === active,
    }),
    [onClick, active],
  );

  return {
    navigate,
    active,
    receiveProps,
  };
};

export const usePage = (id: string) => {
  const { isCurrent, depth } = useContext(RouteContext);
  const { route } = useRoute();

  return useMemo<IRouteContext>(
    () => ({
      isCurrent: isCurrent ? route?.name.split('.')[depth - 1] === id : false,
      depth,
    }),
    [route, isCurrent, depth, id],
  );
};
