import { attach } from 'effector';
import { vk } from './domain';
import { initParams } from 'features/router';
import bridge from '@vkontakte/vk-bridge';
import qs from 'querystring';

export interface IToken {
  token: string;
  scope: string[];
}

const _getToken = vk
  .createEffect<{ scope: string[]; state: IToken }, IToken>('getToken')
  .use(async ({ scope, state }) => {
    if (state.token && scope.every((s) => s === '' || state.scope.includes(s)))
      return state;

    const data = await bridge.send('VKWebAppGetAuthToken', {
      app_id: parseInt(process.env['REACT_APP_ID']),
      scope: scope.join(','),
    });

    return {
      token: data.access_token,
      scope: data.scope === '' ? [] : data.scope.split(','),
    };
  });

const params = qs.parse(initParams);
const access = (params['vk_access_token_settings'] as string) || '';
const scope = access.split(',');

export const $token = vk
  .createStore<IToken>({ token: '', scope }, { name: 'token' })
  .on(_getToken.doneData, (_, payload) => payload);

export const getToken = attach({
  effect: _getToken,
  source: $token,
  mapParams: (params: string[] | void, data) => ({
    scope: params || [],
    state: data,
  }),
});
