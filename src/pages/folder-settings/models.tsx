import React, { useCallback } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import {
  CREATE_INVITE_MUTATION,
  CreateInvite,
  CreateInviteVariables,
  DELETE_INVITE_MUTATION,
  DeleteInvite,
  DeleteInviteVariables,
  FolderFragment,
  FOLDER_FRAGMENT,
} from 'api';
import { useLocation } from 'features/router';
import bridge from '@vkontakte/vk-bridge';

export const useModel = () => {
  const { router, goBack, params } = useLocation();

  const id = params.folderId as string;

  const client = useApolloClient();

  const [createInvite, { loading: creating }] = useMutation<
    CreateInvite,
    CreateInviteVariables
  >(CREATE_INVITE_MUTATION);
  const onCreateInvite = useCallback(() => {
    createInvite({
      variables: {
        input: {
          id,
        },
      },
    })
      .then(({ data }) => {
        client.writeFragment<Partial<FolderFragment>>({
          fragment: FOLDER_FRAGMENT,
          id: client.cache.identify({
            id,
            __typename: 'FolderDto',
          }),
          data: {
            invite: data.createInvite,
          },
        });
      })
      .catch(console.error);
  }, [id, createInvite, client]);

  const [deleteInvite, { loading: deleting }] = useMutation<
    DeleteInvite,
    DeleteInviteVariables
  >(DELETE_INVITE_MUTATION);
  const onDeleteInvite = useCallback(() => {
    deleteInvite({
      variables: {
        input: {
          id,
        },
      },
    })
      .then(({ data }) => {
        if (!data.deleteInvite) return;

        client.writeFragment<Partial<FolderFragment>>({
          fragment: FOLDER_FRAGMENT,
          id: client.cache.identify({
            id,
            __typename: 'FolderDto',
          }),
          data: {
            invite: null,
          },
        });
      })
      .catch(console.error);
  }, [id, deleteInvite, client]);

  const share = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const invite = e.currentTarget.dataset.invite;
      const base = `https://vk.com/app${process.env.REACT_APP_ID}`;
      const path = router.buildPath('notes', { folderId: id, invite });
      const link = base + '#' + path;

      bridge.send('VKWebAppShare', { link }).catch(console.error);
    },
    [id, router],
  );

  return {
    router,
    goBack,
    params,
    id,
    onCreateInvite,
    onDeleteInvite,
    loading: creating || deleting,
    share,
  };
};
