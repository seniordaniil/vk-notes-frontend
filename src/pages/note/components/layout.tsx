import { Editor, Node, Transforms } from 'slate';
import React, { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import { CheckListItemElement } from './check-list';
import { ImageElement } from './image';

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

export const RenderedElement: FC<RenderElementProps> = (props) => {
  const { element, attributes, children } = props;

  switch (element.type) {
    case 'title':
      return <h2 {...attributes}>{children}</h2>;
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
    case 'check-list-item':
      return <CheckListItemElement {...props} />;
    case 'img':
      return <ImageElement {...props} />;
  }
};
