import { initParams } from 'features/router';
import qs from 'querystring';

const params = qs.parse(
  process.env.NODE_ENV !== 'production' && process.env.REACT_APP_TOKEN
    ? process.env.REACT_APP_TOKEN
    : initParams,
);

export const currentUserId = parseInt(params.vk_user_id as string);
