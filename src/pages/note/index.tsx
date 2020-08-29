import React, { FC, useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import {
  useVisualViewPort,
  useScrollRestoration,
  PopoutValueContext,
} from 'features/layout';
import { useValue } from 'features/context-manager';
import { usePlatform, getClassName, Footer } from '@vkontakte/vkui';
import {
  EditorBox,
  Editor,
  withLayout,
  RenderedElement,
  EditorBoxProps,
  withChecklists,
  EditorToolbar,
  withImages,
  RemoveAlert,
} from './components';
import { useModel } from './models';
import PanelHeaderBack from 'ui/molecules/panel-header-back';
import styled from 'styled-components';

const Desc = styled(Footer)`
  margin-top: 0px;
  margin-bottom: 0px;
`;

const NotePage: FC = () => {
  const platform = usePlatform();
  const DivClassName = getClassName('Div', platform);

  const {
    id,
    value,
    setValue,
    create,
    update,
    remove,
    back,
    changed,
    updated,
    setChanged,
  } = useModel();

  const [, setPopout] = useValue(PopoutValueContext);
  const onRemove = useCallback(() => {
    setPopout(
      <RemoveAlert
        remove={remove}
        back={back}
        onClose={() => setPopout(null)}
      />,
    );
  }, [remove, setPopout, back]);

  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderedElement {...props} />,
    [],
  );

  const editor = useMemo(
    () => withReact(withChecklists(withImages(withLayout(createEditor())))),
    [],
  );

  useScrollRestoration();
  const height = useVisualViewPort(() => {
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const eBoxProps = useMemo<EditorBoxProps>(() => {
    const unfixed = window.innerHeight > height;

    return {
      height: `${height}px`,
      unfixed,
      platform,
    };
  }, [height, platform]);

  return (
    <>
      <PanelHeaderBack separator={false} onClick={back} label={'Назад'} />
      {value && (
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => {
            setValue(value);
            setChanged(true);
          }}
        >
          <EditorBox {...eBoxProps}>
            <Editor>
              {updated && <Desc>{updated}</Desc>}
              <Editable
                className={`${DivClassName} Editable`}
                renderElement={renderElement}
                placeholder={'Напишите что-нибудь...'}
              />
            </Editor>
            <EditorToolbar
              save={id ? update : create}
              changed={changed}
              onRemove={id ? onRemove : undefined}
            />
          </EditorBox>
        </Slate>
      )}
    </>
  );
};

export default NotePage;
