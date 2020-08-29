import React, { FC } from 'react';
import { PanelHeaderProps } from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import {
  PanelHeaderBack as PanelHeaderBackComponent,
  PanelHeader,
  usePlatform,
  ANDROID,
} from '@vkontakte/vkui';

const PanelHeaderBack: FC<PanelHeaderProps & { label?: string }> = ({
  children,
  onClick,
  label,
  ...props
}) => {
  const platform = usePlatform();

  return (
    <PanelHeader
      {...props}
      left={
        <PanelHeaderBackComponent
          label={platform === ANDROID ? undefined : label}
          onClick={onClick}
        />
      }
    >
      {children}
    </PanelHeader>
  );
};

export default PanelHeaderBack;
