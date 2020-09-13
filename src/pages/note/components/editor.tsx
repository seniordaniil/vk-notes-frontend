import { ANDROID, OS } from '@vkontakte/vkui';
import styled from 'styled-components';

export interface EditorBoxProps {
  viewport: string;
  unfixed?: boolean;
  platform: OS;
}

export const EditorBox = styled.div<EditorBoxProps>`
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  height: ${({ viewport, unfixed, platform }) =>
    `calc(${viewport} - ${
      platform === ANDROID ? '56px' : '52px'
    } - var(--safe-area-inset-top) ${unfixed ? '' : '- 52px'})`};
  justify-content: space-between;

  & .FixedLayout--bottom {
    position: ${({ unfixed }) => (unfixed ? 'static' : 'fixed')};
    padding-bottom: ${({ unfixed }) =>
      unfixed ? '0px' : 'var(--safe-area-inset-bottom)'} !important;
  }
`;

export const Editor = styled.div`
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  padding-top: 0px;
  padding-bottom: 0px;

  & .Editable {
    & * {
      user-select: text !important;
    }

    & *[contenteditable='false'] {
      user-select: none !important;
      & * {
        user-select: none !important;
      }
    }

    & > * {
      box-sizing: border-box;
    }
  }
`;
