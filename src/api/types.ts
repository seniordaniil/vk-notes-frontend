/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFolders
// ====================================================

export interface GetFolders_folders {
  __typename: "FolderDto";
  id: string;
  name: string;
  count: number;
  access: MemberAccess | null;
  date: any;
  invite: string | null;
}

export interface GetFolders {
  folders: GetFolders_folders[];
  foldersCount: number;
}

export interface GetFoldersVariables {
  limit?: number | null;
  offset: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFolder
// ====================================================

export interface CreateFolder_createFolder {
  __typename: "FolderDto";
  id: string;
  name: string;
  count: number;
  access: MemberAccess | null;
  date: any;
  invite: string | null;
}

export interface CreateFolder {
  createFolder: CreateFolder_createFolder;
}

export interface CreateFolderVariables {
  input: CreateFolderInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateFolder
// ====================================================

export interface UpdateFolder {
  updateFolder: boolean;
}

export interface UpdateFolderVariables {
  input: UpdateFolderInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveFolder
// ====================================================

export interface RemoveFolder {
  removeFolder: boolean;
}

export interface RemoveFolderVariables {
  input: ByIdInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LeaveFolder
// ====================================================

export interface LeaveFolder {
  leaveFolder: boolean;
}

export interface LeaveFolderVariables {
  input: ByIdInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RmFolderMember
// ====================================================

export interface RmFolderMember {
  removeMember: boolean;
}

export interface RmFolderMemberVariables {
  input: FolderMemberInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateInvite
// ====================================================

export interface CreateInvite {
  createInvite: string;
}

export interface CreateInviteVariables {
  input: ByIdInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteInvite
// ====================================================

export interface DeleteInvite {
  deleteInvite: boolean;
}

export interface DeleteInviteVariables {
  input: ByIdInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: JoinFolder
// ====================================================

export interface JoinFolder_joinFolder {
  __typename: "FolderRelDto";
  folderId: string;
  userId: number;
  access: MemberAccess;
}

export interface JoinFolder {
  joinFolder: JoinFolder_joinFolder;
}

export interface JoinFolderVariables {
  input: JoinFolderInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFolder
// ====================================================

export interface GetFolder_folder {
  __typename: "FolderDto";
  id: string;
  name: string;
  count: number;
  access: MemberAccess | null;
  date: any;
  invite: string | null;
}

export interface GetFolder_members {
  __typename: "FolderRelDto";
  folderId: string;
  userId: number;
  access: MemberAccess;
  photo: string | null;
  fullName: string | null;
}

export interface GetFolder {
  folder: GetFolder_folder | null;
  membersCount: number;
  members: GetFolder_members[];
}

export interface GetFolderVariables {
  id: string;
  invite?: string | null;
  includeFolder?: boolean | null;
  includeMembersCount?: boolean | null;
  limit?: number | null;
  offset: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNotes
// ====================================================

export interface GetNotes_folder {
  __typename: "FolderDto";
  id: string;
  name: string;
  count: number;
  access: MemberAccess | null;
  date: any;
  invite: string | null;
}

export interface GetNotes_notes {
  __typename: "NoteDto";
  id: string;
  folderId: string;
  updated: any;
  userId: number;
  title: string;
}

export interface GetNotes {
  folder: GetNotes_folder | null;
  notes: GetNotes_notes[];
}

export interface GetNotesVariables {
  id: string;
  invite?: string | null;
  folderId?: string | null;
  offset?: number | null;
  limit: number;
  includeFolder?: boolean | null;
  includeNotes?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNote
// ====================================================

export interface GetNote_note {
  __typename: "NoteDto";
  id: string;
  folderId: string;
  updated: any;
  userId: number;
  text: string | null;
  title: string;
}

export interface GetNote {
  note: GetNote_note | null;
}

export interface GetNoteVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateNote
// ====================================================

export interface UpdateNote {
  updateNote: any;
}

export interface UpdateNoteVariables {
  input: UpdateNoteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateNote
// ====================================================

export interface CreateNote_createNote {
  __typename: "NoteDto";
  id: string;
  updated: any;
}

export interface CreateNote {
  createNote: CreateNote_createNote;
}

export interface CreateNoteVariables {
  input: CreateNoteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveNote
// ====================================================

export interface RemoveNote {
  removeNote: boolean;
}

export interface RemoveNoteVariables {
  input: ByNoteInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FolderFragment
// ====================================================

export interface FolderFragment {
  __typename: "FolderDto";
  id: string;
  name: string;
  count: number;
  access: MemberAccess | null;
  date: any;
  invite: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: NoteFragmentBit
// ====================================================

export interface NoteFragmentBit {
  __typename: "NoteDto";
  id: string;
  folderId: string;
  updated: any;
  userId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: NoteFragmentCut
// ====================================================

export interface NoteFragmentCut {
  __typename: "NoteDto";
  id: string;
  folderId: string;
  updated: any;
  userId: number;
  title: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: NoteFragment
// ====================================================

export interface NoteFragment {
  __typename: "NoteDto";
  id: string;
  folderId: string;
  updated: any;
  userId: number;
  text: string | null;
  title: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum MemberAccess {
  Admin = "Admin",
  Member = "Member",
}

export interface ByIdInput {
  id: string;
}

export interface ByNoteInput {
  folderId: string;
  id: string;
}

export interface CreateFolderInput {
  name: string;
}

export interface CreateNoteInput {
  id: string;
  text?: string | null;
  title: string;
}

export interface FolderMemberInput {
  id: string;
  memberId: number;
}

export interface JoinFolderInput {
  id: string;
  invite: string;
}

export interface UpdateFolderInput {
  id: string;
  name: string;
}

export interface UpdateNoteInput {
  id: string;
  noteId: string;
  text?: string | null;
  title: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
