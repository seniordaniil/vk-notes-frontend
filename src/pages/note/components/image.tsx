import React, { FC, useCallback } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import styled from 'styled-components';

export const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'img' ? true : isVoid(element);
  };

  return editor;
};

const Img = styled.img`
  max-width: 100%;
`;

export const ImageElement: FC<RenderElementProps> = ({
  attributes,
  element,
  children,
}) => {
  const { url } = element;

  const onClick = useCallback(() => {
    bridge
      .send('VKWebAppShowImages', {
        images: [url as string],
      })
      .catch(console.error);
  }, [url]);

  return (
    <div {...attributes} className={'Img'}>
      <div contentEditable={false}>
        <Img src={url as string} onClick={onClick} />
      </div>
      {children}
    </div>
  );
};
