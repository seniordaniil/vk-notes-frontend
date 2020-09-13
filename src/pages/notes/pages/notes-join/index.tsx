import React, { FC, useMemo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { Router } from 'router5';
import { useQuery, useMutation } from '@apollo/client';
import {
  GetFolder,
  GetFolderVariables,
  GET_FOLDER_QUERY,
  JOIN_FOLDER_MUTATION,
  JoinFolderVariables,
  JoinFolder,
} from 'api';
import { $currentUser } from 'features/vk-data';
import { Placeholder, Button, UsersStack } from '@vkontakte/vkui';
import { TiFolder } from 'react-icons/ti';
import Icon from 'ui/atoms/icons';
import plural from 'plural-ru';
import PanelHeaderBack from 'ui/molecules/panel-header-back';

interface NotesJoinPageProps {
  id: string;
  invite: string;
  router: Router;
  goBack: () => void;
}

const NotesJoinPage: FC<NotesJoinPageProps> = ({
  id,
  invite,
  router,
  goBack,
}) => {
  const currentUser = useStore($currentUser);

  const { data } = useQuery<GetFolder, GetFolderVariables>(GET_FOLDER_QUERY, {
    variables: {
      id,
      invite,
      offset: 0,
      limit: 20,
      includeFolder: true,
      includeMembersCount: true,
    },
  });

  const photos = useMemo(
    () =>
      data?.members
        .slice(0, 3)
        .map((member) =>
          member.userId === currentUser?.id
            ? currentUser?.photo
            : member?.photo,
        ),
    [currentUser, data],
  );

  const countDesc = useMemo(
    () =>
      plural(
        data?.membersCount,
        '%d участник',
        '%d участника',
        '%d участников',
      ),
    [data],
  );

  const go = useCallback(() => {
    router.navigate('app.notes', { folderId: id }, { replace: true });
  }, [id, router]);

  const [joinFolder, { loading }] = useMutation<
    JoinFolder,
    JoinFolderVariables
  >(JOIN_FOLDER_MUTATION);

  const join = useCallback(() => {
    joinFolder({
      variables: {
        input: {
          id,
          invite,
        },
      },
    })
      .then(() => {
        go();
      })
      .catch(console.error);
  }, [joinFolder, go, id, invite]);

  if (!data) return null;
  return (
    <>
      <PanelHeaderBack separator={false} onClick={goBack} />
      {!data ? null : (
        <Placeholder
          stretched
          header={data.folder ? data.folder.name : 'Упс!'}
          icon={
            <Icon>
              <TiFolder size={'56px'} />
            </Icon>
          }
          action={
            <Button
              size={'xl'}
              onClick={data.folder ? (data.folder.access ? go : join) : goBack}
              disabled={loading}
            >
              {data.folder
                ? data.folder.access
                  ? 'Перейти'
                  : 'Добавить'
                : 'К папкам'}
            </Button>
          }
        >
          {data.folder ? (
            <>
              <p>
                {data.folder.access
                  ? 'Эта папка уже находится в вашем списке'
                  : 'Вы хотите добавить эту папку в свой список?'}
              </p>
              <UsersStack layout={'vertical'} size={'m'} photos={photos}>
                {countDesc}
              </UsersStack>
            </>
          ) : (
            'Мы не нашли такую папку'
          )}
        </Placeholder>
      )}
    </>
  );
};

export default NotesJoinPage;
