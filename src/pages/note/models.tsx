import { useApolloClient, useMutation } from '@apollo/client';
import {
  CREATE_NOTE_MUTATION,
  CreateNote,
  CreateNoteVariables,
  FOLDER_FRAGMENT,
  FolderFragment,
  GET_NOTE_QUERY,
  GET_NOTES_QUERY,
  GetNote,
  GetNotes,
  GetNotesVariables,
  GetNoteVariables,
  NOTE_FRAGMENT,
  NoteFragment,
  REMOVE_NOTE_MUTATION,
  RemoveNote,
  RemoveNoteVariables,
  UPDATE_NOTE_MUTATION,
  UpdateNote,
  UpdateNoteVariables,
} from 'api';
import { useLocation } from 'features/router';
import { useCallback, useEffect, useState } from 'react';
import { Element, Node } from 'slate';
import { tsFormat } from 'features/note';
import { currentUserId } from 'features/vk-data';

export const useModel = () => {
  const client = useApolloClient();
  const [updateNote] = useMutation<UpdateNote, UpdateNoteVariables>(
    UPDATE_NOTE_MUTATION,
  );
  const [createNote] = useMutation<CreateNote, CreateNoteVariables>(
    CREATE_NOTE_MUTATION,
  );
  const [removeNote] = useMutation<RemoveNote, RemoveNoteVariables>(
    REMOVE_NOTE_MUTATION,
  );

  const { router, goBack, params } = useLocation();

  const [value, setValue] = useState<Node[]>(null);
  const [changed, setChanged] = useState(false);
  const [updated, setUpdated] = useState<string>(null);

  useEffect(() => {
    if (value) return;

    const title: Node = {
      type: 'title',
      children: [
        {
          text: '',
        },
      ],
    };

    if (!params.id) {
      setValue([title]);
    } else {
      client
        .query<GetNote, GetNoteVariables>({
          query: GET_NOTE_QUERY,
          variables: {
            id: params.id,
          },
        })
        .then(({ data }) => {
          title.children[0].text = data.note.title;
          let nodes: Node[] = [title];

          try {
            const text = JSON.parse(data.note.text);
            if (Array.isArray(text)) nodes = nodes.concat(text);
          } catch (e) {}

          setValue(nodes);
          setUpdated(tsFormat(data.note.updated));
        })
        .catch(console.error);
    }
  }, [value, client, params, setValue, setUpdated]);

  const incrNotesCount = useCallback(
    (count: number) => {
      const id = client.cache.identify({
        id: params.folderId,
        __typename: 'FolderDto',
      });

      const folder = client.readFragment<FolderFragment>({
        fragment: FOLDER_FRAGMENT,
        id,
      });

      if (folder) {
        client.writeFragment<Partial<FolderFragment>>({
          fragment: FOLDER_FRAGMENT,
          id,
          data: {
            count: folder.count + count,
          },
        });
      }
    },
    [params, client],
  );

  const update = useCallback(async () => {
    const title = (value[0] as Element).children[0].text as string;
    const textNodes = value.slice(1);
    const text = textNodes.length < 1 ? null : JSON.stringify(textNodes);

    const { data } = await updateNote({
      variables: {
        input: {
          id: params.folderId,
          noteId: params.id,
          title,
          text,
        },
      },
    });

    client.writeFragment<Partial<NoteFragment>>({
      fragment: NOTE_FRAGMENT,
      id: client.cache.identify({
        id: params.id,
        __typename: 'NoteDto',
      }),
      fragmentName: 'NoteFragment',
      data: {
        userId: currentUserId,
        updated: data.updateNote,
        title,
        text,
      },
    });

    setUpdated(tsFormat(data.updateNote));
    setChanged(false);
  }, [params, value, updateNote, setUpdated, setChanged, client]);

  const create = useCallback(async () => {
    const title = (value[0] as Element).children[0].text as string;
    const textNodes = value.slice(1);
    const text = textNodes.length < 1 ? null : JSON.stringify(textNodes);

    const { data } = await createNote({
      variables: {
        input: {
          text,
          title,
          id: params.folderId,
        },
      },
    });

    client.writeQuery<GetNote, GetNoteVariables>({
      query: GET_NOTE_QUERY,
      variables: {
        id: data.createNote.id,
      },
      data: {
        note: {
          __typename: data.createNote.__typename,
          id: data.createNote.id,
          folderId: params.folderId,
          updated: data.createNote.updated,
          title,
          text,
          userId: currentUserId,
        },
      },
    });

    client.writeQuery<Partial<GetNotes>, GetNotesVariables>({
      query: GET_NOTES_QUERY,
      variables: {
        id: params.folderId,
        folderId: params.folderId,
        offset: -1,
        limit: 1,
      },
      data: {
        notes: [
          {
            __typename: data.createNote.__typename,
            id: data.createNote.id,
            folderId: params.folderId,
            updated: data.createNote.updated,
            title,
            userId: currentUserId,
          },
        ],
      },
    });

    setUpdated(tsFormat(data.createNote.updated));
    setChanged(false);

    incrNotesCount(1);

    router.navigate(
      'app.note',
      { id: data.createNote.id, folderId: params.folderId },
      { replace: true },
    );
  }, [
    router,
    params,
    value,
    setUpdated,
    setChanged,
    createNote,
    client,
    incrNotesCount,
  ]);

  const remove = useCallback(async () => {
    const { data } = await removeNote({
      variables: {
        input: {
          id: params.id,
          folderId: params.folderId,
        },
      },
    });

    if (!data.removeNote) return;

    client.cache.evict({
      id: client.cache.identify({
        id: params.id,
        __typename: 'NoteDto',
      }),
    });

    incrNotesCount(-1);
  }, [removeNote, client, params, incrNotesCount]);

  const back = useCallback(() => {
    goBack(() =>
      router.navigate(
        'app.notes',
        { folderId: params.folderId },
        { replace: true },
      ),
    );
  }, [router, goBack, params]);

  return {
    id: params.id,
    value,
    changed,
    setChanged,
    updated,
    setValue,
    create,
    update,
    remove,
    back,
  };
};
