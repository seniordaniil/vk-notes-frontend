import React, { FC, useState, useCallback } from 'react';
import { useStore } from 'effector-react';
import { getToken, $token } from 'features/vk-data';
import { Transforms } from 'slate';
import { useEditor } from 'slate-react';
import { instance } from 'api';
import bridge from '@vkontakte/vk-bridge';
import { useTouchPrevent, useTouch } from 'features/layout';
import { Button, Spinner } from '@vkontakte/vkui';
import { AccessAlert } from './access-alert';
import Toolbar from 'ui/molecules/toolbar';

import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon28EditCircleFillBlue from '@vkontakte/icons/dist/28/edit_circle_fill_blue';

interface EditorToolbarProps {
  onRemove?: () => void;
  save: () => Promise<any>;
  changed: boolean;
  setPopout: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

export const EditorToolbar: FC<EditorToolbarProps> = ({
  onRemove,
  save,
  changed,
  setPopout,
}) => {
  const token = useStore($token);
  const editor = useEditor();

  const [tbRef, setTbRef] = useState<HTMLDivElement>(null);
  useTouchPrevent(tbRef, true);

  const insertCheckListItem = useCallback(() => {
    Transforms.insertNodes(editor, {
      type: 'check-list-item',
      checked: false,
      children: [{ text: '' }],
    });
  }, [editor]);

  const [chRef, setChRef] = useState<HTMLElement>(null);
  useTouch('touchstart', insertCheckListItem, [chRef, insertCheckListItem]);

  const [uploading, setUploading] = useState(false);
  const uploadImage = useCallback(
    async (f: FileList) => {
      const { token } = await getToken(['docs']);

      const { response } = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'docs.getUploadServer',
        params: {
          v: '5.122',
          access_token: token,
        },
      });

      const url = new URL(response.upload_url);

      const formData = new FormData();
      formData.append('file', f[0]);

      const { data } = await instance.post(
        '/upload' + url.pathname + url.search,
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      );

      const { response: res } = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'docs.save',
        params: {
          v: '5.122',
          access_token: token,
          file: data.file,
        },
      });

      console.log('res', res);

      const sizes = res.doc.preview.photo.sizes as PhotoSize[];
      const s: Record<string, PhotoSize> = {};

      for (const size of sizes) {
        s[size.type] = size;
      }

      let src: string;

      if (s['x']) src = s['x'].src;
      else if (s['o']) src = s['o'].src;
      else if (s['i']) src = s['i'].src;
      else if (s['d']) src = s['d'].src;
      else if (s['m']) src = s['m'].src;
      else if (s['s']) src = s['s'].src;

      Transforms.insertNodes(editor, {
        type: 'img',
        url: src,
        children: [{ text: '' }],
      });
    },
    [editor],
  );

  const upload = useCallback(
    (f: FileList) => {
      setUploading(true);
      uploadImage(f)
        .catch(console.error)
        .finally(() => setUploading(false));
    },
    [setUploading, uploadImage],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (token.scope.includes('docs')) upload(files);
      else
        setPopout(
          <AccessAlert
            onClose={() => setPopout(null)}
            onAction={() => upload(files)}
          />,
        );
    },
    [upload, setPopout, token],
  );

  const [saveRef, setSaveRef] = useState<HTMLElement>(null);
  const [saving, setSaving] = useState(false);
  const onSave = useCallback(
    (e: TouchEvent) => {
      const target = e.currentTarget as HTMLButtonElement;
      if (target.getAttribute('disabled') !== null) return;
      if (!save) return;
      setSaving(true);
      save()
        .catch(console.error)
        .finally(() => setSaving(false));
    },
    [save],
  );
  useTouch('touchstart', onSave, [saveRef, onSave]);

  return (
    <>
      <Toolbar getRootRef={(ref) => setTbRef(ref)}>
        <Button mode={'tertiary'} disabled={!onRemove} onClick={onRemove}>
          <Icon28DeleteOutline />
        </Button>
        <Button mode={'tertiary'} getRootRef={(ref) => setChRef(ref)}>
          <Icon28CheckCircleOutline />
        </Button>
        <Button mode={'tertiary'} disabled={uploading} Component={'label'}>
          <input
            type={'file'}
            accept={'image/jpeg, image/jpg'}
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          {uploading ? <Spinner size={'regular'} /> : <Icon28PictureOutline />}
        </Button>
        <Button
          mode={'tertiary'}
          disabled={!changed || saving}
          getRootRef={(ref) => setSaveRef(ref)}
        >
          {saving ? <Spinner size={'regular'} /> : <Icon28EditCircleFillBlue />}
        </Button>
      </Toolbar>
    </>
  );
};

interface PhotoSize {
  type: string;
  src: string;
}
