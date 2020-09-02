import React, { FC } from 'react';
import { GetNotes_notes } from 'api';
import { useTs } from 'features/note';
import { SimpleCell, Separator } from '@vkontakte/vkui';
import { SimpleCellProps } from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import styled from 'styled-components';

const StyledCell = styled(SimpleCell)`
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
`;

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
      <StyledCell {...props} description={updated}>
        {note.title || 'Без названия'}
      </StyledCell>
      {separator && <Separator />}
    </>
  );
};
