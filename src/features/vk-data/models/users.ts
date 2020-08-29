import { attach, forward } from 'effector';
import { vk } from './domain';
import { $token, IToken } from './token';
import bridge from '@vkontakte/vk-bridge';
import produce from 'immer';

export interface UserInfo {
  fullName: string;
  photo: string;
}

export type UsersData = Record<number, UserInfo>;

interface UserFetchData {
  id: number;
  first_name: string;
  last_name: string;
  photo_50: string;
}

const _fetchUsers = vk
  .createEffect<
    { ids: number[]; token: IToken; state: UsersData },
    UserFetchData[]
  >('fetchUsers')
  .use(async ({ ids, token: { token }, state }) => {
    const _ids = ids.filter((id) => !state[id]);
    if (_ids.length < 1) return [];

    const { response } = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'users.get',
      params: {
        v: '5.122',
        access_token: token,
        user_ids: _ids.join(','),
        fields: 'photo_50',
      },
    });

    return response;
  });

interface CurrentUserFetchData extends Omit<UserFetchData, 'photo_50'> {
  photo_100: string;
}

export const fetchCurrentUser = vk
  .createEffect<void, CurrentUserFetchData>('fetchCurrentUser')
  .use(() => bridge.send('VKWebAppGetUserInfo'));

export const $usersInfo = vk
  .createStore<UsersData>(
    {},
    {
      name: 'users',
    },
  )
  .on(_fetchUsers.doneData, (state, payload) =>
    produce(state, (draft) => {
      for (const raw of payload) {
        draft[raw.id] = {
          fullName: `${raw.first_name} ${raw.last_name}`,
          photo: raw.photo_50,
        };
      }
    }),
  )
  .on(fetchCurrentUser.doneData, (state, payload) =>
    produce(state, (draft) => {
      draft[payload.id] = {
        fullName: `${payload.first_name} ${payload.last_name}`,
        photo: payload.photo_100,
      };
    }),
  );

export const fetchUsers = attach({
  effect: _fetchUsers,
  source: [$token, $usersInfo],
  mapParams: (params: number[], [token, state]) => ({
    ids: params,
    token,
    state,
  }),
});

export const fetchUsersEvent = vk.createEvent<number[]>('fetchUsersEvent');

forward({
  from: fetchUsersEvent,
  to: fetchUsers,
});
