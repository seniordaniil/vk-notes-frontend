import React, { FC } from 'react';

const Icon: FC<{ className?: string }> = ({ children, className }) => (
  <div className={'Icon' + (className ? ' ' + className : '')}>{children}</div>
);

export default Icon;
