import { createRouter, State } from 'router5';
import { historyPlugin, canNavigateMiddleware } from 'features/router';
import browserPlugin from 'router5-plugin-browser';
import loggerPlugin from 'router5-plugin-logger';
import bridge from '@vkontakte/vk-bridge';
import { fetchCurrentUser, getToken } from 'features/vk-data';

const redirect = (state: Partial<State>) =>
  Promise.reject({
    redirect: state,
  });

export const router = createRouter(
  [
    {
      path: '/app',
      name: 'app',
      forwardTo: 'app.folders',
      children: [
        {
          path: '/',
          name: 'folders',
        },
        {
          path: '/:folderId?invite',
          name: 'notes',
        },
        {
          path: '/:folderId/note/?id',
          name: 'note',
        },
        {
          path: '/:folderId/settings',
          name: 'folder-settings',
        },
      ],
      canActivate: (router, deps) => (toState) => {
        if (deps.onboarding) return true;

        router.setDependency('ref', toState);

        return redirect({
          name: 'onboarding',
        });
      },
    },
    {
      path: '/:folderId?invite',
      name: 'notes',
      forwardTo: 'app.notes',
    },
    {
      path: '/onboarding',
      name: 'onboarding',
    },
  ],
  { defaultRoute: 'app' },
);

router.useMiddleware(() => canNavigateMiddleware);

router.usePlugin(historyPlugin, browserPlugin({ useHash: true }), loggerPlugin);

bridge.subscribe(({ detail }) => {
  if (detail.type === 'VKWebAppUpdateConfig') {
    const schemeAttribute = document.createAttribute('scheme');
    schemeAttribute.value = detail.data.scheme
      ? detail.data.scheme
      : 'bright_light';

    document.body.attributes.setNamedItem(schemeAttribute);
  }
});

function bootstrap() {
  const onboarding = bridge
    .send('VKWebAppStorageGet', {
      keys: ['onboarding'],
    })
    .then(({ keys }) => {
      router.setDependency('onboarding', keys[0]?.value);
    });

  return Promise.allSettled([getToken(), fetchCurrentUser(), onboarding]);
}

bootstrap()
  .then(() => router.start())
  .then(() => bridge.send('VKWebAppInit'))
  .catch(console.error);
