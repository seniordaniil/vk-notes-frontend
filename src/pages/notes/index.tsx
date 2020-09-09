import React, { FC, useCallback } from 'react';
import { useLocation } from 'features/router';
import { NotesMainPage, NotesJoinPage } from './pages';

const NotesPage: FC = () => {
  const { params, goBack, router } = useLocation();

  const back = useCallback(
    () => goBack(() => router.navigate('app.folders', {}, { replace: true })),
    [goBack, router],
  );

  return (
    <>
      {params?.invite ? (
        <NotesJoinPage
          goBack={back}
          id={params.folderId}
          invite={params.invite}
          router={router}
        />
      ) : (
        <NotesMainPage id={params.folderId} router={router} goBack={back} />
      )}
    </>
  );
};

export default NotesPage;
