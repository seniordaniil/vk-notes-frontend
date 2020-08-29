import { NavigationOptions, PluginFactory, State, Middleware } from 'router5';
import { push, pop, replace, $canNavigate } from './store';
import { getLastDelta, resetLastDelta } from '../utils/public';

export const historyPlugin: PluginFactory = () => ({
  onTransitionSuccess(
    toState?: State,
    fromState?: State,
    opts?: NavigationOptions,
  ) {
    if (fromState && toState.meta?.id < fromState.meta?.id) {
      pop(getLastDelta());
      resetLastDelta();
    } else if (toState) {
      if (opts?.replace) replace(toState.name);
      else push(toState.name);
    }
  },
});

export const canNavigateMiddleware: Middleware = (toState, fromState, done) => {
  if (!$canNavigate.getState()) {
    if (fromState && toState.meta?.id < fromState.meta?.id)
      window.history.go(1);

    return Promise.reject({ code: 'TRANSITION_ERR', error: 'cannot navigate' });
  }
  done();
};
