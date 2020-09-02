import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_FOLDER_QUERY,
  GetFolder,
  GetFolderVariables,
  MemberAccess,
} from 'api';
import { useStore } from 'effector-react';
import { PopoutValueContext, useSlice } from 'features/layout';
import { useValue } from 'features/context-manager';
import { $currentUser } from 'features/vk-data';
import {
  Cell,
  CellButton,
  Group,
  Header,
  Input,
  PullToRefresh,
} from '@vkontakte/vkui';
import { TiFolder } from 'react-icons/ti';
import PanelHeaderBack from 'ui/molecules/panel-header-back';
import Icon from 'ui/atoms/icons';
import styled from 'styled-components';
import {
  MemberCell,
  RemoveAlert,
  UpdateAlert,
  RemoveMemberAlert,
} from './components';
import InfiniteScroll from 'react-infinite-scroll-component';
import plural from 'plural-ru';
import { useModel } from './models';

import Icon24UserAddOutline from '@vkontakte/icons/dist/24/user_add_outline';

const NameInput = styled(Input)`
  & input[disabled] {
    opacity: 1 !important;
  }
`;

const FolderSettingsPage: FC = () => {
  const {
    router,
    goBack,
    id,
    share,
    onDeleteInvite,
    onCreateInvite,
    loading,
  } = useModel();

  const back = useCallback(() => {
    goBack(() =>
      router.navigate('app.notes', { folderId: id }, { replace: true }),
    );
  }, [router, goBack, id]);

  const currentUser = useStore($currentUser);

  const { data, fetchMore } = useQuery<GetFolder, GetFolderVariables>(
    GET_FOLDER_QUERY,
    {
      variables: {
        id,
        includeFolder: true,
        includeMembersCount: true,
        offset: 0,
        limit: 20,
      },
    },
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

  const [members, { next, refresh, setCount }] = useSlice(() => {
    fetchMore({
      variables: {
        offset: data.members.length,
        includeFolder: false,
      },
    }).catch(console.error);
  }, [20, data?.members, fetchMore]);

  const [isFetching, setIsFetching] = useState(false);
  const onRefresh = useCallback(() => {
    setIsFetching(true);
    fetchMore({
      variables: {
        offset: 0,
        includeFolder: true,
      },
    })
      .catch(console.error)
      .finally(() => {
        refresh();
        setIsFetching(false);
      });
  }, [setIsFetching, fetchMore, refresh]);

  const [, setPopout] = useValue(PopoutValueContext);
  const showAlert = useCallback(() => {
    if (data.folder.access === MemberAccess.Admin)
      setPopout(
        <UpdateAlert
          onClose={() => setPopout(null)}
          name={data.folder.name}
          id={id}
        />,
      );
  }, [setPopout, id, data]);

  const showRemoveAlert = useCallback(() => {
    setPopout(
      <RemoveAlert
        onClose={() => setPopout(null)}
        mode={data.folder.access === MemberAccess.Admin ? 'remove' : 'leave'}
        id={id}
      />,
    );
  }, [id, data, setPopout]);

  const membersCount = data?.membersCount;
  const showRmMemberAlert = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const memberId = parseInt(e.currentTarget.dataset.id);
      setPopout(
        <RemoveMemberAlert
          onClose={() => setPopout(null)}
          memberId={memberId}
          id={id}
          count={membersCount}
          setCount={setCount}
        />,
      );
    },
    [setPopout, id, membersCount, setCount],
  );

  return (
    <>
      <PanelHeaderBack separator={true} onClick={back} label={'Назад'}>
        Папка
      </PanelHeaderBack>
      {!!data?.folder && (
        <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
          <Group>
            <Cell
              before={
                <Icon>
                  <TiFolder size={'44px'} />
                </Icon>
              }
            >
              <div onClick={showAlert}>
                <NameInput value={data.folder.name} disabled={true} />
              </div>
            </Cell>
          </Group>
          <Group>
            <CellButton mode={'danger'} onClick={showRemoveAlert}>
              {data.folder.access === MemberAccess.Admin
                ? 'Удалить папку'
                : 'Покинуть папку'}
            </CellButton>
            {data.folder.access === MemberAccess.Admin && (
              <CellButton
                mode={data.folder.invite ? 'danger' : 'primary'}
                disabled={loading}
                onClick={data.folder.invite ? onDeleteInvite : onCreateInvite}
              >
                {data.folder.invite
                  ? 'Удалить ссылку для приглашения'
                  : 'Создать ссылку для приглашения'}
              </CellButton>
            )}
          </Group>
          <Group header={<Header>{countDesc}</Header>}>
            {!!data.folder.invite && (
              <CellButton
                before={<Icon24UserAddOutline />}
                data-invite={data.folder.invite}
                onClick={share}
              >
                Пригласить
              </CellButton>
            )}
            <InfiniteScroll
              next={next}
              hasMore={true}
              loader={null}
              dataLength={members.length}
            >
              {members.map((member) => (
                <MemberCell
                  onClick={showRmMemberAlert}
                  key={member.userId}
                  currentUser={currentUser}
                  member={member}
                  removable={
                    data.folder.access === MemberAccess.Admin &&
                    member.access !== MemberAccess.Admin
                  }
                />
              ))}
            </InfiniteScroll>
          </Group>
        </PullToRefresh>
      )}
    </>
  );
};

export default FolderSettingsPage;
