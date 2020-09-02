import React, { FC, useCallback } from 'react';
import { State } from 'router5';
import { useRouter } from 'react-router5';
import { useMutation } from '@apollo/client';
import {
  CREATE_FOLDER_MUTATION,
  CreateFolder,
  CreateFolderVariables,
} from 'api';
import bridge from '@vkontakte/vk-bridge';
import {
  Placeholder,
  Avatar,
  Button,
  SimpleCell,
  Div,
  FixedLayout,
  PanelHeader,
} from '@vkontakte/vkui';
import styled from 'styled-components';

import logo from './logo150.png';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';

const IntroPlaceholder = styled(Placeholder)`
  & .Placeholder__in {
    padding-bottom: 0px;
    padding-top: 0px;
  }
`;

const OnBoardingPage: FC = () => {
  const router = useRouter();

  const [createFolder, { loading }] = useMutation<
    CreateFolder,
    CreateFolderVariables
  >(CREATE_FOLDER_MUTATION);

  const onClick = useCallback(() => {
    createFolder({
      variables: {
        input: {
          name: 'Мои заметки',
        },
      },
    })
      .catch(console.error)
      .finally(() => {
        const deps = router.getDependencies();
        const ref: State = deps.ref;
        router.setDependencies({
          isUser: true,
          ref: null,
        });

        bridge
          .send('VKWebAppStorageSet', {
            key: 'isUser',
            value: 'true',
          })
          .catch(console.error);

        if (ref) router.navigate(ref.name, ref.params, { replace: true });
        else router.navigateToDefault({ replace: true });
      });
  }, [createFolder, router]);

  return (
    <>
      <PanelHeader separator={false} />
      <Div>
        <IntroPlaceholder
          icon={<Avatar src={logo} size={56} mode={'app'} />}
          header={'Ваши заметки. Порядок. Никаких усилий.'}
        >
          {<p>Создавайте заметки в любых обстоятельствах.</p>}
        </IntroPlaceholder>
      </Div>
      {
        <>
          <SimpleCell
            disabled
            multiline
            before={<Icon28PictureOutline />}
            description={'Вы можете прикреплять фото к своим заметкам'}
          >
            Фото
          </SimpleCell>
          <SimpleCell
            disabled
            multiline
            before={<Icon28CheckCircleOutline />}
            description={'Вы можете создавать чеклисты в заметках'}
          >
            Чеклисты
          </SimpleCell>
          <SimpleCell
            disabled
            multiline
            before={<Icon28Users3Outline />}
            description={
              'Вы можете приглашать других пользователей в свои папки для совместной работы'
            }
          >
            Работа в команде
          </SimpleCell>
        </>
      }
      <FixedLayout vertical={'bottom'} filled>
        <Div>
          <Button size={'xl'} onClick={onClick} disabled={loading}>
            Начать
          </Button>
        </Div>
      </FixedLayout>
    </>
  );
};

export default OnBoardingPage;
