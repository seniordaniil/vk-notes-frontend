import React, { FC, useCallback, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import styled from 'styled-components';
import { useTouchClick } from 'features/layout';

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

const ImgBox = styled.div`
  padding-top: 1em;
  box-sizing: border-box;

  & + * {
    padding-top: 1em;
    box-sizing: border-box;
  }
`;

export const ImageElement: FC<RenderElementProps> = ({
  attributes,
  element,
  children,
}) => {
  const { url } = element;
  const [ref, setRef] = useState<HTMLDivElement>(null);

  const onClick = useCallback(() => {
    bridge
      .send('VKWebAppShowImages', {
        images: [url as string],
      })
      .catch(console.error);
  }, [url]);

  useTouchClick(onClick, [ref, onClick]);

  return (
    <ImgBox {...attributes}>
      <div contentEditable={false} ref={(ref) => setRef(ref)}>
        <Img src={url as string} />
      </div>
      <span style={{ display: 'none' }}>{children}</span>
    </ImgBox>
  );
};
