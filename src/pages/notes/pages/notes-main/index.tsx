import React, { FC, useMemo, useCallback, useState } from 'react';
import { Router } from 'router5';
import { useQuery } from '@apollo/client';
import { GetNotes, GetNotesVariables, GET_NOTES_QUERY } from 'api';
import plural from 'plural-ru';
import { Group, Button, PullToRefresh } from '@vkontakte/vkui';
import { useSlice } from 'features/layout';
import { NoteCell } from './components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from 'ui/molecules/page-header';
import Icon24GearOutline from '@vkontakte/icons/dist/24/gear_outline';
import Icon28WriteSquareOutline from '@vkontakte/icons/dist/28/write_square_outline';
import ToolbarTriple from 'ui/molecules/toolbar-triple';

interface NotesMainPageProps {
  id: string;
  router: Router;
}

const NotesMainPage: FC<NotesMainPageProps> = ({ id, router }) => {
  const variables = useMemo<GetNotesVariables>(
    () => ({
      id,
      folderId: id,
      offset: 0,
      limit: 20,
      includeFolder: true,
      includeNotes: true,
    }),
    [id],
  );

  const { data, fetchMore } = useQuery<GetNotes, GetNotesVariables>(
    GET_NOTES_QUERY,
    {
      variables,
    },
  );

  const countDesc = useMemo(
    () => plural(data?.folder.count, '%d заметка', '%d заметки', '%d заметок'),
    [data],
  );

  const [notes, { next, refresh }] = useSlice(() => {
    fetchMore({
      variables: {
        ...variables,
        offset: data.notes.length,
        includeFolder: false,
        includeNotes: true,
      },
    }).catch(console.error);
  }, [20, data?.notes, fetchMore, variables, data]);

  const [isFetching, setIsFetching] = useState(false);
  const onRefresh = useCallback(() => {
    setIsFetching(true);
    fetchMore({
      variables,
    })
      .catch(console.error)
      .finally(() => {
        refresh();
        setIsFetching(false);
      });
  }, [fetchMore, refresh, setIsFetching, variables]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      router.navigate('app.note', {
        id: e.currentTarget.dataset.id,
        folderId: id,
      });
    },
    [id, router],
  );

  if (!data) return null;
  return (
    <>
      <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
        <PageHeader>{data.folder.name}</PageHeader>
        <Group>
          {notes.length > 0 && (
            <InfiniteScroll
              next={next}
              hasMore={true}
              loader={null}
              dataLength={notes.length}
            >
              {notes.map((note) => (
                <NoteCell
                  note={note}
                  key={note.id}
                  data-id={note.id}
                  separator={true}
                  onClick={onClick}
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
            onClick={() =>
              router.navigate('app.folder-settings', { folderId: id })
            }
          >
            <Icon24GearOutline />
          </Button>
        }
        right={
          <Button
            mode={'tertiary'}
            onClick={() => router.navigate('app.note', { folderId: id })}
          >
            <Icon28WriteSquareOutline height={24} width={24} />
          </Button>
        }
      >
        {countDesc}
      </ToolbarTriple>
    </>
  );
};

export default NotesMainPage;
