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
  Placeholder,
} from '@vkontakte/vkui';
import { FolderCell, CreateAlert } from './components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from 'ui/molecules/page-header';
import { TiFolderAdd, TiFolder } from 'react-icons/ti';
import IconCircle from 'ui/atoms/icon-circle';
import Icon from 'ui/atoms/icons';
import ToolbarTriple from 'ui/molecules/toolbar-triple';
import plural from 'plural-ru';

import Icon24Info from '@vkontakte/icons/dist/24/info';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';

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

  const onCreate = useCallback(() => {
    setPopout(
      <CreateAlert
        count={data.foldersCount}
        onClose={() => setPopout(null)}
        setCount={setCount}
      />,
    );
  }, [setPopout, data, setCount]);

  return (
    <>
      <PanelHeader separator={false} />
      {!!data && (
        <>
          {folders.length > 0 ? (
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
              <PageHeader
                separator={'show'}
                aside={
                  <PanelHeaderButton onClick={onCreate}>
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
          ) : (
            <Placeholder
              stretched
              icon={
                <Icon>
                  <TiFolder size={'56px'} />
                </Icon>
              }
              header={'Нет папок'}
              action={
                <Button size={'l'} onClick={onCreate}>
                  Создать новую
                </Button>
              }
            />
          )}
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
              <Button
                mode={'tertiary'}
                href={`https://vk.com/public${process.env.REACT_APP_GID}`}
                target={'_blank'}
              >
                <Icon28Users3Outline />
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
