import React, { FC, useCallback } from 'react';
import { useLocation } from 'features/router';
import { NotesMainPage, NotesJoinPage } from './pages';
import PanelHeaderBack from 'ui/molecules/panel-header-back';

const NotesPage: FC = () => {
  const { params, goBack, router } = useLocation();

  const back = useCallback(
    () => goBack(() => router.navigate('app.folders', {}, { replace: true })),
    [goBack, router],
  );

  return (
    <>
      <PanelHeaderBack separator={false} onClick={back} label={'Назад'} />
      {params?.invite ? (
        <NotesJoinPage
          goBack={back}
          id={params.folderId}
          invite={params.invite}
          router={router}
        />
      ) : (
        <NotesMainPage id={params.folderId} router={router} />
      )}
    </>
  );
};

export default NotesPage;
