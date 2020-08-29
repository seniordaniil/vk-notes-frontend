import React, { FC } from 'react';
import { HeaderProps } from '@vkontakte/vkui/dist/components/Header/Header';
import { GroupProps } from '@vkontakte/vkui/dist/components/Group/Group';
import { Group, Header } from '@vkontakte/vkui';
import styled from 'styled-components';

const StyledHeader = styled(Header)`
  & .Header__content {
    padding-bottom: 0px !important;
    padding-top: 0px !important;
  }

  & .Header__in {
    align-items: center;
  }
`;

const Title = styled.h1`
  margin-block-end: 0px;
  margin-block-start: 0px;
  font-size: 36px;
  line-height: 40px;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PageHeader: FC<HeaderProps & Pick<GroupProps, 'separator'>> = ({
  children,
  separator,
  ...props
}) => (
  <Group
    separator={separator}
    header={
      <StyledHeader {...props}>
        <Title>{children}</Title>
      </StyledHeader>
    }
  />
);

export default PageHeader;
