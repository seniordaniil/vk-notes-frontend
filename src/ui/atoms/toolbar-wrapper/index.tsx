import React, { FC } from 'react';
import { FixedLayout } from '@vkontakte/vkui';
import { FixedLayoutProps } from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';

export type ToolbarWrapperProps = FixedLayoutProps;

const ToolbarWrapper: FC<ToolbarWrapperProps> = (props) => (
  <FixedLayout vertical={'bottom'} filled {...props} />
);

export default ToolbarWrapper;
