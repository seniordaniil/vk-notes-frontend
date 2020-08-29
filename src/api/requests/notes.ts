import { gql } from '@apollo/client';
import { FOLDER_FRAGMENT } from './folders';

const NOTE_FRAGMENT_BIT = gql`
  fragment NoteFragmentBit on NoteDto {
    id
    folderId
    updated
    userId
    title
  }
`;

export const GET_NOTES_QUERY = gql`
  query GetNotes(
    $id: String!
    $invite: String
    $folderId: String
    $offset: Int = 0
    $limit: Int!
    $includeFolder: Boolean = true
    $includeNotes: Boolean = true
  ) {
    folder(id: $id, invite: $invite) @include(if: $includeFolder) {
      ...FolderFragment
    }

    notes(offset: $offset, limit: $limit, folderId: $folderId)
      @include(if: $includeNotes) {
      ...NoteFragmentBit
    }
  }

  ${NOTE_FRAGMENT_BIT}
  ${FOLDER_FRAGMENT}
`;

export const NOTE_FRAGMENT = gql`
  fragment NoteFragment on NoteDto {
    text
    ...NoteFragmentBit
  }

  ${NOTE_FRAGMENT_BIT}
`;

export const GET_NOTE_QUERY = gql`
  query GetNote($id: String!) {
    note(id: $id) {
      ...NoteFragment
    }
  }
  ${NOTE_FRAGMENT}
`;

export const UPDATE_NOTE_MUTATION = gql`
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input)
  }
`;

export const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      updated
    }
  }
`;

export const REMOVE_NOTE_MUTATION = gql`
  mutation RemoveNote($input: ByNoteInput!) {
    removeNote(input: $input)
  }
`;
