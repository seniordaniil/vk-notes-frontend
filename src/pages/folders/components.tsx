import React, {
  FC,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import {
  CREATE_FOLDER_MUTATION,
  CreateFolder,
  CreateFolderVariables,
  GET_FOLDERS_QUERY,
  GetFolders,
  GetFoldersVariables,
} from 'api';
import { GetFolders_folders } from 'api';
import { SimpleCell, Separator } from '@vkontakte/vkui';
import { AlertNotClosable, useTouchStop } from 'features/layout';
import { TiFolder } from 'react-icons/ti';
import { SimpleCellProps } from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import styled from 'styled-components';
import Icon from 'ui/atoms/icons';
import AlertInput from 'ui/molecules/alert-input';

const StyledCell = styled(SimpleCell)`
  & > .Icon {
    padding-left: 0px !important;
  }
  & .SimpleCell__indicator {
    overflow: initial;
  }
`;

interface FolderCellProps {
  folder: GetFolders_folders;
  separator?: boolean;
}

export const FolderCell: FC<SimpleCellProps & FolderCellProps> = ({
  folder,
  separator,
  ...props
}) => {
  return (
    <>
      <StyledCell
        {...props}
        expandable
        indicator={folder.count}
        before={
          <Icon>
            <TiFolder size={'28px'} />
          </Icon>
        }
      >
        {folder.name}
      </StyledCell>
      {separator && <Separator />}
    </>
  );
};

interface CreateAlertProps {
  onClose: () => void;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}

export const CreateAlert: FC<CreateAlertProps> = ({
  onClose,
  count,
  setCount,
}) => {
  useTouchStop(window, true);
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  const [createFolder, { loading }] = useMutation<
    CreateFolder,
    CreateFolderVariables
  >(CREATE_FOLDER_MUTATION);
  const [name, setName] = useState('');

  const client = useApolloClient();

  const send = useCallback(() => {
    createFolder({
      variables: {
        input: {
          name,
        },
      },
    })
      .then(({ data }) => {
        client.writeQuery<Partial<GetFolders>, GetFoldersVariables>({
          query: GET_FOLDERS_QUERY,
          variables: { offset: -1 },
          data: {
            folders: [data.createFolder],
            foldersCount: count + 1,
          },
        });

        setCount((count) => count + 1);
      })
      .catch(console.error)
      .finally(onClose);
  }, [createFolder, name, onClose, client, count, setCount]);

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
      <h2>Новая папка</h2>
      <p>Введите название для этой папки.</p>
      <AlertInput
        getRef={ref}
        placeholder={'Имя'}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        maxLength={32}
      />
    </AlertNotClosable>
  );
};
