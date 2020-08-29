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
import { $usersInfo } from 'features/vk-data';
import { Placeholder, Button, UsersStack } from '@vkontakte/vkui';
import { TiFolder } from 'react-icons/ti';
import Icon from 'ui/atoms/icons';
import plural from 'plural-ru';

interface NotesJoinPageProps {
  id: string;
  invite: string;
  router: Router;
}

const NotesJoinPage: FC<NotesJoinPageProps> = ({ id, invite, router }) => {
  const users = useStore($usersInfo);

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
    () => data?.members.slice(0, 3).map((user) => users[user.userId]?.photo),
    [users, data],
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

  if (!data?.folder) return null;
  return (
    <Placeholder
      stretched
      header={data.folder.name}
      icon={
        <Icon>
          <TiFolder size={'56px'} />
        </Icon>
      }
      action={
        <Button
          size={'xl'}
          onClick={data.folder.access ? go : join}
          disabled={loading}
        >
          {data.folder.access ? 'Перейти' : 'Добавить'}
        </Button>
      }
    >
      <p>
        {data.folder.access
          ? 'Эта папка уже находится в вашем списке'
          : 'Вы хотите добавить эту папку в свой список?'}
      </p>
      <UsersStack layout={'vertical'} size={'m'} photos={photos}>
        {countDesc}
      </UsersStack>
    </Placeholder>
  );
};

export default NotesJoinPage;
