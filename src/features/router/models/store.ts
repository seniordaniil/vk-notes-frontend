import { createDomain } from 'effector';
import { attachLogger } from 'effector-logger/attach';
import bridge from '@vkontakte/vk-bridge';

const r = createDomain('router');
attachLogger(r);

export const push = r.createEvent<string>('push');
export const replace = r.createEvent<string>('replace');
export const pop = r.createEvent<number | void>('pop');

export const $history = r
  .createStore<string[]>([], { name: 'history' })
  .on(push, (state, payload) => [...state, payload])
  .on(replace, (state, payload) => {
    let depth = 0;

    const current = state[state.length - 1]?.split('.') || [];
    const next = payload.split('.');

    for (let i = 0; i < next.length; i++) {
      if (current[i] !== next[i]) break;
      depth++;
    }

    let sliceLen = 1;
    const currentSlice = current.slice(0, depth).join('.');

    for (let i = state.length - 2; i >= 0; i--) {
      const slice = state[i].split('.').slice(0, depth).join('.');
      if (slice !== currentSlice) break;
      sliceLen++;
    }

    return state.slice(0, state.length - sliceLen).concat([payload]);
  })
  .on(pop, (state, payload) =>
    state.slice(0, state.length + (payload ? payload : -1)),
  );

$history.map<boolean>((state, isEnabled) => {
  if (state.length <= 1 && isEnabled) {
    bridge.send('VKWebAppDisableSwipeBack').catch(console.error);
    isEnabled = false;
  }
  if (state.length > 1 && !isEnabled) {
    bridge.send('VKWebAppEnableSwipeBack').catch(console.error);
    isEnabled = true;
  }
  return isEnabled;
});

export const setCanNavigate = r.createEvent<boolean>('setCanNavigate');

export const $canNavigate = r
  .createStore(true, { name: 'canNavigate' })
  .on(setCanNavigate, (_, payload) => payload);
