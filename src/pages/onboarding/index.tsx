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
import { Placeholder, Avatar, Button } from '@vkontakte/vkui';
import logo from './logo150.png';

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
          onboarding: true,
          ref: null,
        });

        bridge
          .send('VKWebAppStorageSet', {
            key: 'onboarding',
            value: 'true',
          })
          .catch(console.error);

        if (ref) router.navigate(ref.name, ref.params, { replace: true });
        else router.navigateToDefault({ replace: true });
      });
  }, [createFolder, router]);

  return (
    <Placeholder
      stretched
      icon={<Avatar src={logo} size={64} mode={'app'} />}
      header={'Ваши заметки. Порядок. Никаких усилий.'}
      action={
        <Button size={'xl'} onClick={onClick} disabled={loading}>
          Начать
        </Button>
      }
    >
      <p>
        Создавайте заметки в любых обстоятельствах. Быстрее находите нужное.
        Делитесь идеями с другими.
      </p>
    </Placeholder>
  );
};

export default OnBoardingPage;
