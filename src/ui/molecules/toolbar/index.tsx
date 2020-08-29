import React, { FC } from 'react';
import styled from 'styled-components';
import ToolbarWrapper, { ToolbarWrapperProps } from 'ui/atoms/toolbar-wrapper';

const TabsBox = styled.div`
  padding: 4px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  & > * {
    flex: 1;
  }
`;

const Toolbar: FC<ToolbarWrapperProps> = ({ children, ...props }) => (
  <ToolbarWrapper {...props}>
    <TabsBox>{children}</TabsBox>
  </ToolbarWrapper>
);

export default Toolbar;
