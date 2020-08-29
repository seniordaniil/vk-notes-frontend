import { createContext } from 'react';

export interface IRouteContext {
  depth: number;
  isCurrent: boolean;
}

export const RouteContext = createContext<IRouteContext>({
  depth: 0,
  isCurrent: true,
});
