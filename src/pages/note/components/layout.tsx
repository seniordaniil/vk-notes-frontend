import { Editor, Node, Transforms } from 'slate';
import React, { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import { CheckListItemElement } from './check-list';
import { ImageElement } from './image';
import styled from 'styled-components';

export const withLayout = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      const title: Node = { type: 'title', children: [{ text: '' }] };
      if (editor.children.length < 1) {
        Transforms.insertNodes(editor, title, { at: path.concat(0) });
      }

      let isLast = true;

      for (const [child, childPath] of Node.children(editor, path, {
        reverse: true,
      })) {
        if (childPath[0] !== 0 && child.type === 'title') {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: childPath });
        }

        if (childPath[0] === 0) {
          if (child.type === 'paragraph')
            Transforms.setNodes(editor, { type: 'title' }, { at: childPath });
          else if (child.type !== 'title')
            Transforms.insertNodes(editor, title, { at: path.concat(0) });
        }

        if (isLast) {
          isLast = false;

          if (child.type === 'img')
            Transforms.insertNodes(editor, {
              type: 'paragraph',
              children: title.children,
            });
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

const Title = styled.h2`
  font-weight: 600;
  margin-block-start: 0px;
  margin-block-end: 0px;
  font-size: 24px;
  line-height: 28px;
  & + p {
    padding-top: 8px;
    box-sizing: border-box;
  }
`;

const Paragraph = styled.p`
  margin-block-start: 0px;
  margin-block-end: 0px;
  font-size: 16px;
  line-height: 20px;
`;

export const RenderedElement: FC<RenderElementProps> = (props) => {
  const { element, attributes, children } = props;

  switch (element.type) {
    case 'title':
      return <Title {...attributes}>{children}</Title>;
    case 'paragraph':
      return <Paragraph {...attributes}>{children}</Paragraph>;
    case 'check-list-item':
      return <CheckListItemElement {...props} />;
    case 'img':
      return <ImageElement {...props} />;
  }
};
