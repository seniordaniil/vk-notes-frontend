import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FOLDERS_QUERY, GetFolders, GetFoldersVariables } from 'api';
import { useSlice, PopoutValueContext } from 'features/layout';
import { useValue } from 'features/context-manager';
import { useLocation } from 'features/router';
import {
  PanelHeader,
  Group,
  PanelHeaderButton,
  PullToRefresh,
  Button,
} from '@vkontakte/vkui';
import { FolderCell, CreateAlert } from './components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from 'ui/molecules/page-header';
import { TiFolderAdd } from 'react-icons/ti';
import IconCircle from 'ui/atoms/icon-circle';
import ToolbarTriple from 'ui/molecules/toolbar-triple';
import plural from 'plural-ru';
import bridge from '@vkontakte/vk-bridge';

import Icon24Like from '@vkontakte/icons/dist/24/like';
import Icon24Info from '@vkontakte/icons/dist/24/info';

const FoldersPage: FC = () => {
  const { router } = useLocation();
  const [, setPopout] = useValue(PopoutValueContext);

  const { data, fetchMore } = useQuery<GetFolders, GetFoldersVariables>(
    GET_FOLDERS_QUERY,
    {
      variables: {
        limit: 20,
        offset: 0,
      },
    },
  );

  const countDesc = useMemo(
    () => plural(data?.foldersCount, '%d папка', '%d папки', '%d папок'),
    [data],
  );

  const [folders, { next, refresh, setCount }] = useSlice(() => {
    fetchMore({
      variables: {
        offset: data.folders.length,
      },
    }).catch(console.error);
  }, [20, data?.folders, fetchMore]);

  const [isFetching, setIsFetching] = useState(false);
  const onRefresh = useCallback(() => {
    setIsFetching(true);
    fetchMore({
      variables: {
        offset: 0,
      },
    })
      .catch(console.error)
      .finally(() => {
        refresh();
        setIsFetching(false);
      });
  }, [fetchMore, refresh]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      router.navigate('app.notes', {
        folderId: e.currentTarget.dataset.id,
      });
    },
    [router],
  );

  const join = useCallback(() => {
    bridge
      .send('VKWebAppJoinGroup', {
        group_id: parseInt(process.env.REACT_APP_GID),
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <PanelHeader separator={false} />
      {!!data && (
        <>
          <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
            <PageHeader
              separator={'show'}
              aside={
                <PanelHeaderButton
                  onClick={() =>
                    setPopout(
                      <CreateAlert
                        count={data.foldersCount}
                        onClose={() => setPopout(null)}
                        setCount={setCount}
                      />,
                    )
                  }
                >
                  <IconCircle
                    size={'28px'}
                    color={'#ffffff'}
                    bg={'var(--accent)'}
                  >
                    <TiFolderAdd size={'20px'} />
                  </IconCircle>
                </PanelHeaderButton>
              }
            >
              Папки
            </PageHeader>
            <Group>
              {folders.length > 0 && (
                <InfiniteScroll
                  next={next}
                  hasMore={true}
                  loader={null}
                  dataLength={folders.length}
                >
                  {folders.map((folder) => (
                    <FolderCell
                      key={folder.id}
                      folder={folder}
                      data-id={folder.id}
                      onClick={onClick}
                      separator={true}
                    />
                  ))}
                </InfiniteScroll>
              )}
            </Group>
          </PullToRefresh>
          <ToolbarTriple
            left={
              <Button
                mode={'tertiary'}
                href={process.env.REACT_APP_HELP}
                target={'_blank'}
              >
                <Icon24Info />
              </Button>
            }
            right={
              <Button mode={'tertiary'} onClick={join}>
                <Icon24Like />
              </Button>
            }
          >
            {countDesc}
          </ToolbarTriple>
        </>
      )}
    </>
  );
};

export default FoldersPage;
