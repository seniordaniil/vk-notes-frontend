import React, { FC, useCallback, useState } from 'react';
import {
  AlertNotClosable,
  useTouchPrevent,
  useTouchStop,
} from 'features/layout';
import { useCanNavigate } from 'features/router';

interface RemoveAlertProps {
  remove: () => Promise<void>;
  back: () => void;
  onClose: () => void;
}

export const RemoveAlert: FC<RemoveAlertProps> = ({
  remove,
  back,
  onClose,
}) => {
  const [removing, setRemoving] = useState(false);
  useTouchStop(window, true);
  useTouchPrevent(window, true);
  const [, setCanNavigate] = useCanNavigate(false, true);

  const onClick = useCallback(() => {
    setRemoving(true);
    remove()
      .then(() => {
        onClose();
        setCanNavigate(true);
        back();
      })
      .catch(() => onClose());
  }, [setRemoving, back, onClose, remove, setCanNavigate]);

  return (
    <AlertNotClosable
      actionsLayout={'vertical'}
      onClose={onClose}
      onClick={removing ? undefined : onClose}
      actions={[
        {
          title: 'Удалить',
          mode: 'destructive',
          action: removing ? undefined : onClick,
        },
        {
          title: 'Отмена',
          autoclose: true,
          mode: 'cancel',
        },
      ]}
    >
      <h2>Подтвердите действие</h2>
      <p>Вы уверены, что хотите удалить эту заметку?</p>
    </AlertNotClosable>
  );
};
