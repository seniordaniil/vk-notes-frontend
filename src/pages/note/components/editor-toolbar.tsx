import React, { FC, useState, useCallback } from 'react';
import { getToken } from 'features/vk-data';
import { Transforms } from 'slate';
import { useEditor } from 'slate-react';
import { instance } from 'api';
import bridge from '@vkontakte/vk-bridge';
import { useTouchPrevent, useTouch } from 'features/layout';
import { Button, Spinner } from '@vkontakte/vkui';
import Toolbar from 'ui/molecules/toolbar';

import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon28EditCircleFillBlue from '@vkontakte/icons/dist/28/edit_circle_fill_blue';

interface EditorToolbarProps {
  onRemove?: () => void;
  save: () => Promise<any>;
  changed: boolean;
}

const group = parseInt(process.env.REACT_APP_GROUP_ID);
const album = parseInt(process.env.REACT_APP_ALBUM);

export const EditorToolbar: FC<EditorToolbarProps> = ({
  onRemove,
  save,
  changed,
}) => {
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
      const { token } = await getToken(['photos']);

      const { response } = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getUploadServer',
        params: {
          v: '5.122',
          access_token: token,
          album_id: album,
          group_id: group,
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
        method: 'photos.save',
        params: {
          v: '5.122',
          access_token: token,
          album_id: album,
          group_id: group,
          server: data.server,
          photos_list: data.photos_list,
          hash: data.hash,
        },
      });

      const sizes = res[0].sizes as any[];

      Transforms.insertNodes(editor, {
        type: 'img',
        url: sizes.find((size) => size.type === 'x').url,
        children: [{ text: '' }],
      });
    },
    [editor],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUploading(true);
      uploadImage(e.currentTarget.files)
        .catch(console.error)
        .finally(() => setUploading(false));
    },
    [setUploading, uploadImage],
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
