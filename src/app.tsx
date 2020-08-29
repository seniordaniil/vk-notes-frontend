import React, { FC } from 'react';
import { ConfigProvider } from '@vkontakte/vkui';
import { Switch, goBack } from 'features/router';
import { withValue, useValue } from 'features/context-manager';
import { PopoutValueContext } from 'features/layout';
import {
  NotesPage,
  FoldersPage,
  FolderSettingsPage,
  NotePage,
  OnBoardingPage,
} from 'pages';

export const App: FC = () => {
  return (
    <ConfigProvider
      isWebView={process.env.NODE_ENV !== 'production' || undefined}
    >
      <Switch.Epic tabbar={null}>
        <AppView id={'app'} />
        <Switch.Page id={'onboarding'}>
          <OnBoardingPage />
        </Switch.Page>
      </Switch.Epic>
    </ConfigProvider>
  );
};

const AppView = withValue<{ id: string }>(
  ({ id }) => {
    const [popout] = useValue(PopoutValueContext);

    return (
      <Switch.View id={id} history={true} onSwipeBack={goBack} popout={popout}>
        <Switch.Panel id={'folders'}>
          <FoldersPage />
        </Switch.Panel>
        <Switch.Panel id={'notes'}>
          <NotesPage />
        </Switch.Panel>
        <Switch.Panel id={'note'}>
          <NotePage />
        </Switch.Panel>
        <Switch.Panel id={'folder-settings'}>
          <FolderSettingsPage />
        </Switch.Panel>
      </Switch.View>
    );
  },
  [PopoutValueContext],
);
