import { gql } from '@apollo/client';

export const FOLDER_FRAGMENT = gql`
  fragment FolderFragment on FolderDto {
    id
    name
    count
    access
    date
    invite
  }
`;

export const GET_FOLDERS_QUERY = gql`
  query GetFolders($limit: Int = 0, $offset: Int!) {
    folders(limit: $limit, offset: $offset) {
      ...FolderFragment
    }

    foldersCount
  }

  ${FOLDER_FRAGMENT}
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      ...FolderFragment
    }
  }
  ${FOLDER_FRAGMENT}
`;

export const UPDATE_FOLDER_MUTATION = gql`
  mutation UpdateFolder($input: UpdateFolderInput!) {
    updateFolder(input: $input)
  }
`;

export const REMOVE_FOLDER_MUTATION = gql`
  mutation RemoveFolder($input: ByIdInput!) {
    removeFolder(input: $input)
  }
`;

export const LEAVE_FOLDER_MUTATION = gql`
  mutation LeaveFolder($input: ByIdInput!) {
    leaveFolder(input: $input)
  }
`;

export const RM_FOLDER_MEMBER_MUTATION = gql`
  mutation RmFolderMember($input: FolderMemberInput!) {
    removeMember(input: $input)
  }
`;

export const CREATE_INVITE_MUTATION = gql`
  mutation CreateInvite($input: ByIdInput!) {
    createInvite(input: $input)
  }
`;

export const DELETE_INVITE_MUTATION = gql`
  mutation DeleteInvite($input: ByIdInput!) {
    deleteInvite(input: $input)
  }
`;

export const JOIN_FOLDER_MUTATION = gql`
  mutation JoinFolder($input: JoinFolderInput!) {
    joinFolder(input: $input) {
      folderId
      userId
      access
    }
  }
`;

export const GET_FOLDER_QUERY = gql`
  query GetFolder(
    $id: String!
    $invite: String
    $includeFolder: Boolean = true
    $includeMembersCount: Boolean = true
    $limit: Int = 0
    $offset: Int!
  ) {
    folder(id: $id, invite: $invite) @include(if: $includeFolder) {
      ...FolderFragment
    }

    membersCount(id: $id) @include(if: $includeMembersCount)

    members(id: $id, limit: $limit, offset: $offset) {
      folderId
      userId
      access
    }
  }
  ${FOLDER_FRAGMENT}
`;
