import styled from 'styled-components';

const IconCircle = styled.div<{ size: string; bg: string; color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  background-color: ${({ bg }) => bg};
  color: ${({ color }) => color};
`;

export default IconCircle;
