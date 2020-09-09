import { debounce } from 'throttle-debounce';

let lastDelta: number = -1;

export const getLastDelta = () => lastDelta;
export const resetLastDelta = (delta?: number) => {
  lastDelta = delta ?? -1;
};

export const goBack = debounce(10, true, (delta = -1) => {
  lastDelta = delta;
  window.history.go(delta);
});

export const initParams = window.location.search.slice(1);

window.history.replaceState(
  null,
  null,
  window.location.origin + window.location.pathname + window.location.hash,
);
