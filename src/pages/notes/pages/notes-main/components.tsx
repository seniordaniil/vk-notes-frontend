import React, { FC } from 'react';
import { GetNotes_notes } from 'api';
import { useTs } from 'features/note';
import { SimpleCell, Separator } from '@vkontakte/vkui';
import { SimpleCellProps } from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';

interface NoteCellProps {
  note: GetNotes_notes;
  separator?: boolean;
}

export const NoteCell: FC<SimpleCellProps & NoteCellProps> = ({
  note,
  separator,
  ...props
}) => {
  const updated = useTs(note.updated);

  return (
    <>
      <SimpleCell {...props} description={updated}>
        {note.title || 'Без названия'}
      </SimpleCell>
      {separator && <Separator />}
    </>
  );
};
