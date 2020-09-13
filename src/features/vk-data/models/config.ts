import { vk } from './domain';

interface Config {
  app: string;
  appearance: string;
  app_id: string;
  scheme: string;
  start_time: number;
  insets: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  }
}

export const updateConfig = vk.createEvent<Config>('updateConfig');

export const $config = vk.createStore<Config>(null, { name: 'config' }).on(updateConfig, (_, payload) => payload);