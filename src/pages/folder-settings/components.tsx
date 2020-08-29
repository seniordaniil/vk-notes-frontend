import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserInfo } from 'features/vk-data';
import { SimpleCell, Avatar, Button } from '@vkontakte/vkui';
import {
  UPDATE_FOLDER_MUTATION,
  UpdateFolder,
  UpdateFolderVariables,
  GetFolder_members,
  FolderFragment,
  FOLDER_FRAGMENT,
  REMOVE_FOLDER_MUTATION,
  RemoveFolder,
  RemoveFolderVariables,
  LEAVE_FOLDER_MUTATION,
  LeaveFolder,
  LeaveFolderVariables,
  GetFolders,
  GetFoldersVariables,
  GET_FOLDERS_QUERY,
  RM_FOLDER_MEMBER_MUTATION,
  RmFolderMember,
  RmFolderMemberVariables,
  GET_FOLDER_QUERY,
  GetFolder,
  GetFolderVariables,
} from 'api';
import { useTouchStop } from 'features/layout/models';
import { useApolloClient, useMutation } from '@apollo/client';
import { AlertNotClosable } from 'features/layout/components';
import AlertInput from 'ui/molecules/alert-input';
import { useCanNavigate, useLocation } from 'features/router';
import styled from 'styled-components';

import Icon28RemoveCircleOutline from '@vkontakte/icons/dist/28/remove_circle_outline';

const ButtonDestructive = styled(Button)`
  padding: 0px !important;
  & .Icon {
    color: var(--destructive) !important;
    padding: 0px !important;
  }
  & .Button__content {
    padding: 0px !important;
  }
`;

interface MemberCellProps {
  removable: boolean;
  member: GetFolder_members;
  user?: UserInfo;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MemberCell: FC<MemberCellProps> = ({
  removable,
  user,
  member,
  onClick,
}) => {
  return (
    <SimpleCell
      disabled={true}
      after={
        removable && (
          <ButtonDestructive
            mode={'tertiary'}
            data-id={member.userId}
            onClick={onClick}
          >
            <Icon28RemoveCircleOutline />
          </ButtonDestructive>
        )
      }
      before={<Avatar src={user?.photo} size={40} />}
    >
      {user?.fullName}
    </SimpleCell>
  );
};

interface UpdateAlertProps {
  onClose: () => void;
  name: string;
  id: string;
}

export const UpdateAlert: FC<UpdateAlertProps> = ({
  id,
  onClose,
  name: initialName,
}) => {
  useTouchStop(window, true);
  const [, setCanNavigate] = useCanNavigate(false, true);
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  const [updateFolder, { loading }] = useMutation<
    UpdateFolder,
    UpdateFolderVariables
  >(UPDATE_FOLDER_MUTATION);
  const [name, setName] = useState(initialName);

  const client = useApolloClient();

  const send = useCallback(() => {
    updateFolder({
      variables: {
        input: {
          id,
          name,
        },
      },
    })
      .then(({ data }) => {
        if (!data.updateFolder) return;

        client.writeFragment<Partial<FolderFragment>>({
          fragment: FOLDER_FRAGMENT,
          id: client.cache.identify({
            id,
            __typename: 'FolderDto',
          }),
          data: {
            name,
          },
        });
      })
      .catch(console.error)
      .finally(() => {
        onClose();
        setCanNavigate(true);
      });
  }, [updateFolder, name, onClose, client, id, setCanNavigate]);

  return (
    <AlertNotClosable
      actions={[
        {
          title: 'Отменить',
          mode: 'cancel',
          action: loading ? undefined : onClose,
        },
        {
          title: 'Сохранить',
          mode: 'default',
          action: !name || loading ? undefined : send,
        },
      ]}
      onClose={onClose}
      onClick={loading ? undefined : onClose}
    >
      <h2>Новое имя</h2>
      <p>Введите название для этой папки.</p>
      <AlertInput
        getRef={ref}
        placeholder={'Имя'}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
    </AlertNotClosable>
  );
};

interface RemoveAlertProps {
  onClose: () => void;
  mode: 'remove' | 'leave';
  id: string;
}

export const RemoveAlert: FC<RemoveAlertProps> = ({ id, onClose, mode }) => {
  const { router, goBack } = useLocation();

  useTouchStop(window, true);
  const [, setCanNavigate] = useCanNavigate(false, true);

  const client = useApolloClient();

  const back = useCallback(() => {
    try {
      const query = client.readQuery<GetFolders, GetFoldersVariables>({
        query: GET_FOLDERS_QUERY,
      });

      if (typeof query?.foldersCount === 'number')
        client.writeQuery<Partial<GetFolders>, GetFoldersVariables>({
          query: GET_FOLDERS_QUERY,
          data: {
            foldersCount: query.foldersCount - 1,
          },
        });
    } catch (e) {}

    onClose();
    setCanNavigate(true);
    goBack(() => router.navigate('app.folders', {}, { replace: true }), -2);
  }, [goBack, setCanNavigate, onClose, client, router]);

  const [removeFolder, { loading: removing }] = useMutation<
    RemoveFolder,
    RemoveFolderVariables
  >(REMOVE_FOLDER_MUTATION);

  const onRemove = useCallback(() => {
    removeFolder({
      variables: {
        input: {
          id,
        },
      },
    })
      .then(({ data }) => {
        if (!data.removeFolder) return;

        client.cache.evict({
          id: client.cache.identify({
            id,
            __typename: 'FolderDto',
          }),
        });

        back();
      })
      .catch(() => onClose());
  }, [removeFolder, id, back, client, onClose]);

  const [leaveFolder, { loading: leaving }] = useMutation<
    LeaveFolder,
    LeaveFolderVariables
  >(LEAVE_FOLDER_MUTATION);

  const onLeave = useCallback(() => {
    leaveFolder({
      variables: {
        input: {
          id,
        },
      },
    })
      .then(({ data }) => {
        if (!data.leaveFolder) return;

        client.cache.evict({
          id: client.cache.identify({
            id,
            __typename: 'FolderDto',
          }),
        });

        back();
      })
      .catch(() => onClose());
  }, [leaveFolder, id, back, onClose, client]);

  const loading = leaving || removing;

  return (
    <AlertNotClosable
      actions={[
        {
          title: 'Отменить',
          mode: 'cancel',
          action: loading ? undefined : onClose,
        },
        {
          title: mode === 'remove' ? 'Удалить' : 'Покинуть',
          mode: 'destructive',
          action: loading ? undefined : mode === 'remove' ? onRemove : onLeave,
        },
      ]}
      onClose={onClose}
      onClick={loading ? undefined : onClose}
    >
      <h2>Подтвердите действие</h2>
      <p>{`Вы действительно хотите ${
        mode === 'remove' ? 'удалить' : 'покинуть'
      } эту папку?`}</p>
    </AlertNotClosable>
  );
};

interface RemoveMemberAlertProps {
  onClose: () => void;
  id: string;
  memberId: number;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}

export const RemoveMemberAlert: FC<RemoveMemberAlertProps> = ({
  id,
  memberId,
  onClose,
  count,
  setCount,
}) => {
  useTouchStop(window, true);
  useCanNavigate(false, true);

  const client = useApolloClient();

  const [rmFolderMember, { loading }] = useMutation<
    RmFolderMember,
    RmFolderMemberVariables
  >(RM_FOLDER_MEMBER_MUTATION);

  const onRemove = useCallback(() => {
    rmFolderMember({
      variables: {
        input: {
          memberId,
          id,
        },
      },
    })
      .then(({ data }) => {
        if (!data.removeMember) return;

        client.cache.evict({
          id: client.cache.identify({
            __typename: 'FolderRelDto',
            userId: memberId,
            folderId: id,
          }),
        });

        client.writeQuery<Partial<GetFolder>, Partial<GetFolderVariables>>({
          query: GET_FOLDER_QUERY,
          variables: {
            id,
          },
          data: {
            membersCount: count - 1,
          },
        });

        setCount((count) => count - 1);
      })
      .catch(console.error)
      .finally(() => onClose());
  }, [rmFolderMember, id, memberId, count, setCount, client, onClose]);

  return (
    <AlertNotClosable
      actions={[
        {
          title: 'Отменить',
          mode: 'cancel',
          action: loading ? undefined : onClose,
        },
        {
          title: 'Удалить',
          mode: 'destructive',
          action: loading ? undefined : onRemove,
        },
      ]}
      onClose={onClose}
      onClick={loading ? undefined : onClose}
    >
      <h2>Подтвердите действие</h2>
      <p>
        Вы действительно хотите удалить этого пользователя из списка участников?
      </p>
    </AlertNotClosable>
  );
};
