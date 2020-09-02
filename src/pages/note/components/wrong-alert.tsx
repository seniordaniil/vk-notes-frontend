import React, { FC } from 'react';
import { AlertNotClosable, useTouchStop } from 'features/layout';
import { useCanNavigate } from 'features/router';

interface WrongAlertProps {
  onClose: () => void;
}

export const WrongAlert: FC<WrongAlertProps> = ({ onClose }) => {
  useTouchStop(window, true);
  useCanNavigate(false, true);

  return (
    <AlertNotClosable
      actionsLayout={'vertical'}
      onClose={onClose}
      onClick={onClose}
      actions={[
        {
          title: 'ОК',
          autoclose: true,
          mode: 'cancel',
        },
      ]}
    >
      <h2>Слишком длинная заметка!</h2>
      <p>Попробуйте укоротить вашу заметку</p>
    </AlertNotClosable>
  );
};
