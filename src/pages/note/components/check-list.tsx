import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
import { Editor, Point, Range, Transforms, Element } from 'slate';
import {
  RenderElementProps,
  useEditor,
  useReadOnly,
  ReactEditor,
} from 'slate-react';
import { useTouch } from 'features/layout';
import styled from 'styled-components';

import Icon16Done from '@vkontakte/icons/dist/16/done';

export const withChecklists = (editor: Editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === 'check-list-item',
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          Transforms.setNodes(
            editor,
            { type: 'paragraph' },
            { match: (n) => n.type === 'check-list-item' },
          );
          return;
        }
      }
    }

    return deleteBackward(...args);
  };

  return editor;
};

const CheckListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  word-break: break-word;
  * + & {
    padding-top: 1em;
  }
  & + & {
    padding-top: 8px;
  }
  & + :not(&) {
    padding-top: 1em;
  }
  &:last-child {
    padding-bottom: 1em;
  }
`;

const CheckBox = styled.div<{ checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  width: 24px;
  box-sizing: border-box;
  border: ${({ checked }) =>
    checked ? 'none' : '2px solid var(--icon_secondary)'};
  border-radius: 50%;
  background-color: ${({ checked }) =>
    checked ? 'var(--accent)' : 'transparent'};
  color: #ffffff;
  margin-right: 8px;
`;

export const CheckListItemElement: FC<RenderElementProps> = ({
  children,
  element,
  attributes,
}) => {
  const editor = useEditor();
  const readOnly = useReadOnly();
  const { checked } = element;

  const elRef = useRef<Element>(element);

  useEffect(() => {
    elRef.current = element;
  }, [elRef, element]);

  const onChange = useCallback(() => {
    if (readOnly) return;

    const element = elRef.current;
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { checked: !element.checked }, { at: path });
  }, [editor, elRef, readOnly]);

  const [ref, setRef] = useState<HTMLElement>(null);
  useTouch('touchstart', onChange, [ref, onChange]);

  return (
    <CheckListItem {...attributes}>
      <span contentEditable={false}>
        <CheckBox checked={checked as boolean} ref={(ref) => setRef(ref)}>
          {checked && <Icon16Done />}
        </CheckBox>
      </span>
      <span contentEditable={!readOnly}>{children}</span>
    </CheckListItem>
  );
};
