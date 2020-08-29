import React, { FC } from 'react';
import styled from 'styled-components';
import ToolbarWrapper, { ToolbarWrapperProps } from 'ui/atoms/toolbar-wrapper';

interface TabsBoxProps {
  size?: string;
}

const TabsBox = styled.div<TabsBoxProps>`
  padding: 4px 0px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: ${({ size }) => size || 'auto'};
`;

const TabsItem = styled.div<{ align: 1 | 2 | 3 }>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => {
    switch (align) {
      case 1:
        return 'flex-start';
      case 2:
        return 'center';
      case 3:
        return 'flex-end';
    }
  }};
  grid-column: ${({ align }) => align};
`;

interface ToolbarTripleProps extends TabsBoxProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const ToolbarTriple: FC<ToolbarTripleProps & ToolbarWrapperProps> = ({
  left,
  right,
  size,
  children,
  ...props
}) => {
  return (
    <ToolbarWrapper {...props}>
      <TabsBox size={size}>
        {left && <TabsItem align={1}>{left}</TabsItem>}
        {children && <TabsItem align={2}>{children}</TabsItem>}
        {right && <TabsItem align={3}>{right}</TabsItem>}
      </TabsBox>
    </ToolbarWrapper>
  );
};

export default ToolbarTriple;
