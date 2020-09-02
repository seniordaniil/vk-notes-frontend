import { createRouter, State } from 'router5';
import { historyPlugin, canNavigateMiddleware } from 'features/router';
import { fetchCurrentUser } from 'features/vk-data';
import browserPlugin from 'router5-plugin-browser';
import loggerPlugin from 'router5-plugin-logger';
import bridge from '@vkontakte/vk-bridge';

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
        if (deps.isUser) return true;

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
    console.log('update data', detail.data);
    const schemeAttribute = document.createAttribute('scheme');
    schemeAttribute.value = detail.data.scheme || 'bright_light';

    document.body.attributes.setNamedItem(schemeAttribute);
  }
});

/*const deleteIsUser = () => {
  return bridge.send('VKWebAppStorageSet', {
    key: 'isUser',
    value: '',
  });
};*/

function bootstrap() {
  const onboarding = bridge
    .send('VKWebAppStorageGet', {
      keys: ['isUser'],
    })
    .then(({ keys }) => {
      router.setDependency('isUser', keys[0]?.value);
    });

  return onboarding;
}

bootstrap()
  .then(() => router.start())
  .then(() => fetchCurrentUser())
  .then(() => bridge.send('VKWebAppInit'))
  .catch(console.error);
