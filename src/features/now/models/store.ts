import { createDomain } from 'effector';

const n = createDomain('now');

const updateNow = n.createEvent('updateNow');

export const $now = n
  .createStore(Date.now(), { name: 'now' })
  .on(updateNow, () => Date.now());

setInterval(() => updateNow(), [1000]);
