import { createDomain } from 'effector';
import { attachLogger } from 'effector-logger/attach';

export const vk = createDomain('vk-data');
attachLogger(vk);
