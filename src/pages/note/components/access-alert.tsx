import React, { FC } from 'react';
import {
  AlertNotClosable,
  useTouchPrevent,
  useTouchStop,
} from 'features/layout';
import { useCanNavigate } from 'features/router';

interface AccessAlertProps {
  onClose: () => void;
  onAction: () => void;
}

export const AccessAlert: FC<AccessAlertProps> = ({ onClose, onAction }) => {
  useTouchStop(window, true);
  useTouchPrevent(window, true);
  useCanNavigate(false, true);

  return (
    <AlertNotClosable
      actionsLayout={'horizontal'}
      onClose={onClose}
      onClick={onClose}
      actions={[
        {
          title: 'Отмена',
          autoclose: true,
          mode: 'cancel',
        },
        {
          title: 'Хорошо',
          mode: 'default',
          autoclose: true,
          action: onAction,
        },
      ]}
    >
      <h2>Приложению требуются дополнительные права для загрузки фото!</h2>
    </AlertNotClosable>
  );
};
