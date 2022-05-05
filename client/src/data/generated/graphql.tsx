import * as Apollo from '@apollo/client';
import {gql} from '@apollo/client';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AddChatInput = {
  avatarId?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type AddMessageInput = {
  attachmentsIds: Array<Scalars['String']>;
  chatId: Scalars['ID'];
  replyToId?: InputMaybe<Scalars['ID']>;
  text: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  access: ChatAccess;
  avatar?: Maybe<File>;
  createdAt: Scalars['Timestamp'];
  creator: User;
  deletedAt?: Maybe<Scalars['Timestamp']>;
  id: Scalars['ID'];
  invites: Array<ChatInvite>;
  lastMessage?: Maybe<Message>;
  lastSeen?: Maybe<Scalars['Timestamp']>;
  messages: Array<Message>;
  name: Scalars['String'];
  status: ChatStatus;
  updatedAt: Scalars['Timestamp'];
  users: Array<ChatUser>;
};

export enum ChatAccess {
  InviteOnly = 'INVITE_ONLY',
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type ChatInvite = {
  __typename?: 'ChatInvite';
  chat: Chat;
  expiredAt?: Maybe<Scalars['Timestamp']>;
  id: Scalars['String'];
  leftUses?: Maybe<Scalars['Int']>;
  token: Scalars['String'];
};

export enum ChatInviteUsageTerm {
  Infinite = 'INFINITE',
  OneDay = 'ONE_DAY',
  OneHour = 'ONE_HOUR',
  SevenDays = 'SEVEN_DAYS',
  ThirtyDays = 'THIRTY_DAYS',
  ThirtyMinutes = 'THIRTY_MINUTES',
  TwelveHours = 'TWELVE_HOURS'
}

export enum ChatStatus {
  Blocked = 'BLOCKED',
  BlockedAndDeleted = 'BLOCKED_AND_DELETED',
  Default = 'DEFAULT',
  Deleted = 'DELETED'
}

export type ChatUser = {
  __typename?: 'ChatUser';
  chat: Chat;
  createdAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
  lastSeen?: Maybe<Scalars['Timestamp']>;
  role: ChatUserRole;
  status: ChatUserStatus;
  updatedAt: Scalars['Timestamp'];
  user: User;
};

export enum ChatUserRole {
  Admin = 'ADMIN',
  Default = 'DEFAULT',
  Moderator = 'MODERATOR',
  Owner = 'OWNER'
}

export enum ChatUserStatus {
  Blocked = 'BLOCKED',
  BlockedAndLeaved = 'BLOCKED_AND_LEAVED',
  BlockedAndMuted = 'BLOCKED_AND_MUTED',
  BlockedAndMutedAndLeaved = 'BLOCKED_AND_MUTED_AND_LEAVED',
  Default = 'DEFAULT',
  Leaved = 'LEAVED',
  Muted = 'MUTED',
  MutedAndLeaved = 'MUTED_AND_LEAVED'
}

export type ChatUsersResult = {
  __typename?: 'ChatUsersResult';
  chatUsers: Array<ChatUser>;
  hasMore: Scalars['Boolean'];
};

export type ChatsResult = {
  __typename?: 'ChatsResult';
  chats: Array<Chat>;
  hasMore: Scalars['Boolean'];
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['Timestamp'];
  id: Scalars['ID'];
  originalName: Scalars['String'];
  size: Scalars['Float'];
  type: FileType;
  updatedAt: Scalars['Timestamp'];
  url: Scalars['String'];
};

export enum FileType {
  Image = 'IMAGE',
  Raw = 'RAW',
  Video = 'VIDEO'
}

export type GenerateChatInviteInput = {
  chatId: Scalars['ID'];
  maxUses?: InputMaybe<Scalars['Int']>;
  usageTerm: ChatInviteUsageTerm;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  attachments: Array<MessageFile>;
  chat: Chat;
  createdAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
  id: Scalars['ID'];
  replyTo?: Maybe<Message>;
  sender: User;
  text: Scalars['String'];
  updatedAt: Scalars['Timestamp'];
};

export type MessageFile = {
  __typename?: 'MessageFile';
  createdAt: Scalars['Timestamp'];
  file: File;
  message: Message;
};

export type MessagesResult = {
  __typename?: 'MessagesResult';
  hasMore: Scalars['Boolean'];
  messages: Array<Message>;
};

export type Mutation = {
  __typename?: 'Mutation';
  activateInvite: Scalars['Boolean'];
  addChat: Chat;
  addMessage: Message;
  changeLastSeen: Scalars['Boolean'];
  generateInvite: Scalars['Boolean'];
  joinChat: ChatUser;
  leaveChat: Scalars['Boolean'];
  login: User;
  logout: Scalars['Boolean'];
  multipleUpload: Array<File>;
  recoverChat: Chat;
  recoverMessage: Message;
  recoverUser: User;
  removeChat: Scalars['Boolean'];
  removeInvite: Scalars['Boolean'];
  removeMe: Scalars['Boolean'];
  removeMessage: Scalars['Boolean'];
  removeUser: Scalars['Boolean'];
  signUp: User;
  singleUpload: File;
  updateProfile: User;
};


export type MutationActivateInviteArgs = {
  token: Scalars['String'];
};


export type MutationAddChatArgs = {
  input: AddChatInput;
};


export type MutationAddMessageArgs = {
  input: AddMessageInput;
};


export type MutationChangeLastSeenArgs = {
  chatId: Scalars['ID'];
  lastSeen: Scalars['Timestamp'];
};


export type MutationGenerateInviteArgs = {
  input: GenerateChatInviteInput;
};


export type MutationJoinChatArgs = {
  chatId: Scalars['ID'];
};


export type MutationLeaveChatArgs = {
  chatId: Scalars['ID'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMultipleUploadArgs = {
  files: Array<Scalars['Upload']>;
};


export type MutationRecoverChatArgs = {
  id: Scalars['ID'];
};


export type MutationRecoverMessageArgs = {
  id: Scalars['ID'];
};


export type MutationRecoverUserArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveChatArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveInviteArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveMessageArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['ID'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type Query = {
  __typename?: 'Query';
  chat: Chat;
  chatUser: ChatUser;
  chatUsers: ChatUsersResult;
  chats: ChatsResult;
  checkInvite: Scalars['Boolean'];
  me: User;
  message: Message;
  messages: MessagesResult;
  searchChats: ChatsResult;
  user: User;
  users: Array<User>;
};


export type QueryChatArgs = {
  id: Scalars['ID'];
};


export type QueryChatUserArgs = {
  chatId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type QueryChatUsersArgs = {
  chatId: Scalars['ID'];
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
  lastUserId?: InputMaybe<Scalars['ID']>;
};


export type QueryChatsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
  lastId?: InputMaybe<Scalars['ID']>;
};


export type QueryCheckInviteArgs = {
  token: Scalars['String'];
};


export type QueryMessageArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  chatId: Scalars['ID'];
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
  lastId?: InputMaybe<Scalars['ID']>;
};


export type QuerySearchChatsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
  lastId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type SignUpInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  chatAdded: Chat;
  chatInviteAdded: ChatInvite;
  chatInviteRemoved: ChatInvite;
  chatInviteUpdated: ChatInvite;
  chatJoined: Chat;
  chatLeaved: Chat;
  chatRemoved: Chat;
  chatUpdated: Chat;
  chatUserJoined: ChatUser;
  chatUserLeaved: ChatUser;
  chatUserUpdated: ChatUser;
  lastSeenChanged: ChatUser;
  messageAdded: Message;
  messageRemoved: Message;
  messageUpdated: Message;
  profileUpdated: User;
};


export type SubscriptionChatAddedArgs = {
  userId: Scalars['ID'];
};


export type SubscriptionChatInviteAddedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatInviteRemovedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatInviteUpdatedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatJoinedArgs = {
  userId: Scalars['ID'];
};


export type SubscriptionChatLeavedArgs = {
  userId: Scalars['ID'];
};


export type SubscriptionChatRemovedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatUpdatedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatUserJoinedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatUserLeavedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionChatUserUpdatedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionLastSeenChangedArgs = {
  userId: Scalars['ID'];
};


export type SubscriptionMessageAddedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionMessageRemovedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionMessageUpdatedArgs = {
  chatId: Scalars['ID'];
};


export type SubscriptionProfileUpdatedArgs = {
  userId: Scalars['ID'];
};

export type UpdateProfileInput = {
  avatarId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<File>;
  createdAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  status: UserStatus;
  updatedAt: Scalars['Timestamp'];
};

export enum UserStatus {
  Blocked = 'BLOCKED',
  BlockedAndDeleted = 'BLOCKED_AND_DELETED',
  Default = 'DEFAULT',
  Deleted = 'DELETED'
}

export type ChatModelFragment = { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null };

export type FullChatModelFragment = { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> }>, users: Array<{ __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } }>, invites: Array<{ __typename?: 'ChatInvite', id: string, token: string, expiredAt?: any | null, leftUses?: number | null, chat: { __typename?: 'Chat', id: string } }>, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null };

export type ChatInviteModelFragment = { __typename?: 'ChatInvite', id: string, token: string, expiredAt?: any | null, leftUses?: number | null, chat: { __typename?: 'Chat', id: string } };

export type ChatUserModelFragment = { __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type FileModelFragment = { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any };

export type MessageModelFragment = { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> };

export type UserModelFragment = { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null };

export type AddChatMutationVariables = Exact<{
  input: AddChatInput;
}>;


export type AddChatMutation = { __typename?: 'Mutation', addChat: { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type RemoveChatMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveChatMutation = { __typename?: 'Mutation', removeChat: boolean };

export type ActivateInviteMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ActivateInviteMutation = { __typename?: 'Mutation', activateInvite: boolean };

export type GenerateInviteMutationVariables = Exact<{
  input: GenerateChatInviteInput;
}>;


export type GenerateInviteMutation = { __typename?: 'Mutation', generateInvite: boolean };

export type RemoveInviteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveInviteMutation = { __typename?: 'Mutation', removeInvite: boolean };

export type JoinChatMutationVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type JoinChatMutation = { __typename?: 'Mutation', joinChat: { __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } };

export type ChangeLastSeenMutationVariables = Exact<{
  chatId: Scalars['ID'];
  lastSeen: Scalars['Timestamp'];
}>;


export type ChangeLastSeenMutation = { __typename?: 'Mutation', changeLastSeen: boolean };

export type LeaveChatMutationVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type LeaveChatMutation = { __typename?: 'Mutation', leaveChat: boolean };

export type SingleUploadMutationVariables = Exact<{
  input: Scalars['Upload'];
}>;


export type SingleUploadMutation = { __typename?: 'Mutation', singleUpload: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } };

export type MultipleUploadMutationVariables = Exact<{
  input: Array<Scalars['Upload']> | Scalars['Upload'];
}>;


export type MultipleUploadMutation = { __typename?: 'Mutation', multipleUpload: Array<{ __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }> };

export type AddMessageMutationVariables = Exact<{
  input: AddMessageInput;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type ChatsQueryVariables = Exact<{
  lastId?: InputMaybe<Scalars['ID']>;
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
}>;


export type ChatsQuery = { __typename?: 'Query', chats: { __typename?: 'ChatsResult', hasMore: boolean, chats: Array<{ __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }> } };

export type SearchChatsQueryVariables = Exact<{
  lastId?: InputMaybe<Scalars['ID']>;
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type SearchChatsQuery = { __typename?: 'Query', searchChats: { __typename?: 'ChatsResult', hasMore: boolean, chats: Array<{ __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }> } };

export type ChatQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChatQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> }>, users: Array<{ __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } }>, invites: Array<{ __typename?: 'ChatInvite', id: string, token: string, expiredAt?: any | null, leftUses?: number | null, chat: { __typename?: 'Chat', id: string } }>, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type CheckInviteQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type CheckInviteQuery = { __typename?: 'Query', checkInvite: boolean };

export type ChatUsersQueryVariables = Exact<{
  chatId: Scalars['ID'];
  lastUserId?: InputMaybe<Scalars['ID']>;
  count?: InputMaybe<Scalars['Int']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
}>;


export type ChatUsersQuery = { __typename?: 'Query', chatUsers: { __typename?: 'ChatUsersResult', hasMore: boolean, chatUsers: Array<{ __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } }> } };

export type ChatUserQueryVariables = Exact<{
  chatId: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type ChatUserQuery = { __typename?: 'Query', chatUser: { __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } };

export type MessagesQueryVariables = Exact<{
  chatId: Scalars['ID'];
  lastId?: InputMaybe<Scalars['ID']>;
  lastCreatedAt?: InputMaybe<Scalars['Timestamp']>;
  count?: InputMaybe<Scalars['Int']>;
}>;


export type MessagesQuery = { __typename?: 'Query', messages: { __typename?: 'MessagesResult', hasMore: boolean, messages: Array<{ __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> }> } };

export type MessageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MessageQuery = { __typename?: 'Query', message: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }> };

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type ChatAddedSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type ChatAddedSubscription = { __typename?: 'Subscription', chatAdded: { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type ChatUpdatedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatUpdatedSubscription = { __typename?: 'Subscription', chatUpdated: { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type ChatRemovedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatRemovedSubscription = { __typename?: 'Subscription', chatRemoved: { __typename?: 'Chat', id: string } };

export type ChatJoinedSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type ChatJoinedSubscription = { __typename?: 'Subscription', chatJoined: { __typename?: 'Chat', id: string, name: string, access: ChatAccess, status: ChatStatus, createdAt: any, updatedAt: any, lastSeen?: any | null, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, lastMessage?: { __typename?: 'Message', id: string, text: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export type ChatLeavedSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type ChatLeavedSubscription = { __typename?: 'Subscription', chatLeaved: { __typename?: 'Chat', id: string } };

export type ChatInviteAddedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatInviteAddedSubscription = { __typename?: 'Subscription', chatInviteAdded: { __typename?: 'ChatInvite', id: string, token: string, expiredAt?: any | null, leftUses?: number | null, chat: { __typename?: 'Chat', id: string } } };

export type ChatInviteUpdatedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatInviteUpdatedSubscription = { __typename?: 'Subscription', chatInviteUpdated: { __typename?: 'ChatInvite', id: string, token: string, expiredAt?: any | null, leftUses?: number | null, chat: { __typename?: 'Chat', id: string } } };

export type ChatInviteRemovedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatInviteRemovedSubscription = { __typename?: 'Subscription', chatInviteRemoved: { __typename?: 'ChatInvite', id: string, token: string, expiredAt?: any | null, leftUses?: number | null, chat: { __typename?: 'Chat', id: string } } };

export type ChatUserJoinedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatUserJoinedSubscription = { __typename?: 'Subscription', chatUserJoined: { __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } };

export type ChatUserLeavedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatUserLeavedSubscription = { __typename?: 'Subscription', chatUserLeaved: { __typename?: 'ChatUser', user: { __typename?: 'User', id: string }, chat: { __typename?: 'Chat', id: string } } };

export type ChatUserUpdatedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type ChatUserUpdatedSubscription = { __typename?: 'Subscription', chatUserUpdated: { __typename?: 'ChatUser', status: ChatUserStatus, role: ChatUserRole, chat: { __typename?: 'Chat', id: string }, user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } };

export type LastSeenChangedSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type LastSeenChangedSubscription = { __typename?: 'Subscription', lastSeenChanged: { __typename?: 'ChatUser', lastSeen?: any | null, chat: { __typename?: 'Chat', id: string } } };

export type MessageAddedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, chat: { __typename?: 'Chat', id: string, name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null }, replyTo?: { __typename?: 'Message', id: string, text: string, createdAt: any, updatedAt: any, sender: { __typename?: 'User', name: string, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } } | null, attachments: Array<{ __typename?: 'MessageFile', file: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any }, message: { __typename?: 'Message', id: string } }> } };

export type MessageRemovedSubscriptionVariables = Exact<{
  chatId: Scalars['ID'];
}>;


export type MessageRemovedSubscription = { __typename?: 'Subscription', messageRemoved: { __typename?: 'Message', id: string, chat: { __typename?: 'Chat', id: string } } };

export type ProfileUpdatedSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type ProfileUpdatedSubscription = { __typename?: 'Subscription', profileUpdated: { __typename?: 'User', id: string, name: string, email: string, createdAt: any, updatedAt: any, status: UserStatus, avatar?: { __typename?: 'File', id: string, url: string, size: number, type: FileType, originalName: string, createdAt: any } | null } };

export const FileModelFragmentDoc = gql`
    fragment FileModel on File {
  id
  url
  size
  type
  originalName
  createdAt
}
    `;
export const UserModelFragmentDoc = gql`
    fragment UserModel on User {
  id
  name
  email
  createdAt
  updatedAt
  status
  avatar {
    ...FileModel
  }
}
    ${FileModelFragmentDoc}`;
export const ChatModelFragmentDoc = gql`
    fragment ChatModel on Chat {
  id
  name
  access
  status
  createdAt
  updatedAt
  lastSeen
  creator {
    ...UserModel
  }
  lastMessage {
    id
    text
    createdAt
    sender {
      ...UserModel
    }
  }
  avatar {
    ...FileModel
  }
}
    ${UserModelFragmentDoc}
${FileModelFragmentDoc}`;
export const MessageModelFragmentDoc = gql`
    fragment MessageModel on Message {
  id
  text
  createdAt
  updatedAt
  sender {
    ...UserModel
  }
  chat {
    id
    name
    avatar {
      ...FileModel
    }
  }
  replyTo {
    id
    text
    createdAt
    updatedAt
    sender {
      name
      avatar {
        ...FileModel
      }
    }
  }
  attachments {
    file {
      ...FileModel
    }
    message {
      id
    }
  }
}
    ${UserModelFragmentDoc}
${FileModelFragmentDoc}`;
export const ChatUserModelFragmentDoc = gql`
    fragment ChatUserModel on ChatUser {
  status
  role
  chat {
    id
  }
  user {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;
export const ChatInviteModelFragmentDoc = gql`
    fragment ChatInviteModel on ChatInvite {
  id
  token
  expiredAt
  leftUses
  chat {
    id
  }
}
    `;
export const FullChatModelFragmentDoc = gql`
    fragment FullChatModel on Chat {
  ...ChatModel
  messages {
    ...MessageModel
  }
  users {
    ...ChatUserModel
  }
  invites {
    ...ChatInviteModel
  }
}
    ${ChatModelFragmentDoc}
${MessageModelFragmentDoc}
${ChatUserModelFragmentDoc}
${ChatInviteModelFragmentDoc}`;
export const AddChatDocument = gql`
    mutation AddChat($input: AddChatInput!) {
  addChat(input: $input) {
    ...ChatModel
  }
}
    ${ChatModelFragmentDoc}`;
export type AddChatMutationFn = Apollo.MutationFunction<AddChatMutation, AddChatMutationVariables>;

/**
 * __useAddChatMutation__
 *
 * To run a mutation, you first call `useAddChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addChatMutation, { data, loading, error }] = useAddChatMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddChatMutation(baseOptions?: Apollo.MutationHookOptions<AddChatMutation, AddChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddChatMutation, AddChatMutationVariables>(AddChatDocument, options);
      }
export type AddChatMutationHookResult = ReturnType<typeof useAddChatMutation>;
export type AddChatMutationResult = Apollo.MutationResult<AddChatMutation>;
export type AddChatMutationOptions = Apollo.BaseMutationOptions<AddChatMutation, AddChatMutationVariables>;
export const RemoveChatDocument = gql`
    mutation RemoveChat($id: ID!) {
  removeChat(id: $id)
}
    `;
export type RemoveChatMutationFn = Apollo.MutationFunction<RemoveChatMutation, RemoveChatMutationVariables>;

/**
 * __useRemoveChatMutation__
 *
 * To run a mutation, you first call `useRemoveChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeChatMutation, { data, loading, error }] = useRemoveChatMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveChatMutation(baseOptions?: Apollo.MutationHookOptions<RemoveChatMutation, RemoveChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveChatMutation, RemoveChatMutationVariables>(RemoveChatDocument, options);
      }
export type RemoveChatMutationHookResult = ReturnType<typeof useRemoveChatMutation>;
export type RemoveChatMutationResult = Apollo.MutationResult<RemoveChatMutation>;
export type RemoveChatMutationOptions = Apollo.BaseMutationOptions<RemoveChatMutation, RemoveChatMutationVariables>;
export const ActivateInviteDocument = gql`
    mutation ActivateInvite($token: String!) {
  activateInvite(token: $token)
}
    `;
export type ActivateInviteMutationFn = Apollo.MutationFunction<ActivateInviteMutation, ActivateInviteMutationVariables>;

/**
 * __useActivateInviteMutation__
 *
 * To run a mutation, you first call `useActivateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateInviteMutation, { data, loading, error }] = useActivateInviteMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useActivateInviteMutation(baseOptions?: Apollo.MutationHookOptions<ActivateInviteMutation, ActivateInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActivateInviteMutation, ActivateInviteMutationVariables>(ActivateInviteDocument, options);
      }
export type ActivateInviteMutationHookResult = ReturnType<typeof useActivateInviteMutation>;
export type ActivateInviteMutationResult = Apollo.MutationResult<ActivateInviteMutation>;
export type ActivateInviteMutationOptions = Apollo.BaseMutationOptions<ActivateInviteMutation, ActivateInviteMutationVariables>;
export const GenerateInviteDocument = gql`
    mutation GenerateInvite($input: GenerateChatInviteInput!) {
  generateInvite(input: $input)
}
    `;
export type GenerateInviteMutationFn = Apollo.MutationFunction<GenerateInviteMutation, GenerateInviteMutationVariables>;

/**
 * __useGenerateInviteMutation__
 *
 * To run a mutation, you first call `useGenerateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateInviteMutation, { data, loading, error }] = useGenerateInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateInviteMutation(baseOptions?: Apollo.MutationHookOptions<GenerateInviteMutation, GenerateInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateInviteMutation, GenerateInviteMutationVariables>(GenerateInviteDocument, options);
      }
export type GenerateInviteMutationHookResult = ReturnType<typeof useGenerateInviteMutation>;
export type GenerateInviteMutationResult = Apollo.MutationResult<GenerateInviteMutation>;
export type GenerateInviteMutationOptions = Apollo.BaseMutationOptions<GenerateInviteMutation, GenerateInviteMutationVariables>;
export const RemoveInviteDocument = gql`
    mutation RemoveInvite($id: ID!) {
  removeInvite(id: $id)
}
    `;
export type RemoveInviteMutationFn = Apollo.MutationFunction<RemoveInviteMutation, RemoveInviteMutationVariables>;

/**
 * __useRemoveInviteMutation__
 *
 * To run a mutation, you first call `useRemoveInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeInviteMutation, { data, loading, error }] = useRemoveInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveInviteMutation(baseOptions?: Apollo.MutationHookOptions<RemoveInviteMutation, RemoveInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveInviteMutation, RemoveInviteMutationVariables>(RemoveInviteDocument, options);
      }
export type RemoveInviteMutationHookResult = ReturnType<typeof useRemoveInviteMutation>;
export type RemoveInviteMutationResult = Apollo.MutationResult<RemoveInviteMutation>;
export type RemoveInviteMutationOptions = Apollo.BaseMutationOptions<RemoveInviteMutation, RemoveInviteMutationVariables>;
export const JoinChatDocument = gql`
    mutation JoinChat($chatId: ID!) {
  joinChat(chatId: $chatId) {
    ...ChatUserModel
  }
}
    ${ChatUserModelFragmentDoc}`;
export type JoinChatMutationFn = Apollo.MutationFunction<JoinChatMutation, JoinChatMutationVariables>;

/**
 * __useJoinChatMutation__
 *
 * To run a mutation, you first call `useJoinChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinChatMutation, { data, loading, error }] = useJoinChatMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useJoinChatMutation(baseOptions?: Apollo.MutationHookOptions<JoinChatMutation, JoinChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinChatMutation, JoinChatMutationVariables>(JoinChatDocument, options);
      }
export type JoinChatMutationHookResult = ReturnType<typeof useJoinChatMutation>;
export type JoinChatMutationResult = Apollo.MutationResult<JoinChatMutation>;
export type JoinChatMutationOptions = Apollo.BaseMutationOptions<JoinChatMutation, JoinChatMutationVariables>;
export const ChangeLastSeenDocument = gql`
    mutation ChangeLastSeen($chatId: ID!, $lastSeen: Timestamp!) {
  changeLastSeen(chatId: $chatId, lastSeen: $lastSeen)
}
    `;
export type ChangeLastSeenMutationFn = Apollo.MutationFunction<ChangeLastSeenMutation, ChangeLastSeenMutationVariables>;

/**
 * __useChangeLastSeenMutation__
 *
 * To run a mutation, you first call `useChangeLastSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeLastSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeLastSeenMutation, { data, loading, error }] = useChangeLastSeenMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      lastSeen: // value for 'lastSeen'
 *   },
 * });
 */
export function useChangeLastSeenMutation(baseOptions?: Apollo.MutationHookOptions<ChangeLastSeenMutation, ChangeLastSeenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeLastSeenMutation, ChangeLastSeenMutationVariables>(ChangeLastSeenDocument, options);
      }
export type ChangeLastSeenMutationHookResult = ReturnType<typeof useChangeLastSeenMutation>;
export type ChangeLastSeenMutationResult = Apollo.MutationResult<ChangeLastSeenMutation>;
export type ChangeLastSeenMutationOptions = Apollo.BaseMutationOptions<ChangeLastSeenMutation, ChangeLastSeenMutationVariables>;
export const LeaveChatDocument = gql`
    mutation LeaveChat($chatId: ID!) {
  leaveChat(chatId: $chatId)
}
    `;
export type LeaveChatMutationFn = Apollo.MutationFunction<LeaveChatMutation, LeaveChatMutationVariables>;

/**
 * __useLeaveChatMutation__
 *
 * To run a mutation, you first call `useLeaveChatMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveChatMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveChatMutation, { data, loading, error }] = useLeaveChatMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useLeaveChatMutation(baseOptions?: Apollo.MutationHookOptions<LeaveChatMutation, LeaveChatMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveChatMutation, LeaveChatMutationVariables>(LeaveChatDocument, options);
      }
export type LeaveChatMutationHookResult = ReturnType<typeof useLeaveChatMutation>;
export type LeaveChatMutationResult = Apollo.MutationResult<LeaveChatMutation>;
export type LeaveChatMutationOptions = Apollo.BaseMutationOptions<LeaveChatMutation, LeaveChatMutationVariables>;
export const SingleUploadDocument = gql`
    mutation SingleUpload($input: Upload!) {
  singleUpload(file: $input) {
    ...FileModel
  }
}
    ${FileModelFragmentDoc}`;
export type SingleUploadMutationFn = Apollo.MutationFunction<SingleUploadMutation, SingleUploadMutationVariables>;

/**
 * __useSingleUploadMutation__
 *
 * To run a mutation, you first call `useSingleUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSingleUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [singleUploadMutation, { data, loading, error }] = useSingleUploadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSingleUploadMutation(baseOptions?: Apollo.MutationHookOptions<SingleUploadMutation, SingleUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SingleUploadMutation, SingleUploadMutationVariables>(SingleUploadDocument, options);
      }
export type SingleUploadMutationHookResult = ReturnType<typeof useSingleUploadMutation>;
export type SingleUploadMutationResult = Apollo.MutationResult<SingleUploadMutation>;
export type SingleUploadMutationOptions = Apollo.BaseMutationOptions<SingleUploadMutation, SingleUploadMutationVariables>;
export const MultipleUploadDocument = gql`
    mutation MultipleUpload($input: [Upload!]!) {
  multipleUpload(files: $input) {
    ...FileModel
  }
}
    ${FileModelFragmentDoc}`;
export type MultipleUploadMutationFn = Apollo.MutationFunction<MultipleUploadMutation, MultipleUploadMutationVariables>;

/**
 * __useMultipleUploadMutation__
 *
 * To run a mutation, you first call `useMultipleUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMultipleUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [multipleUploadMutation, { data, loading, error }] = useMultipleUploadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMultipleUploadMutation(baseOptions?: Apollo.MutationHookOptions<MultipleUploadMutation, MultipleUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MultipleUploadMutation, MultipleUploadMutationVariables>(MultipleUploadDocument, options);
      }
export type MultipleUploadMutationHookResult = ReturnType<typeof useMultipleUploadMutation>;
export type MultipleUploadMutationResult = Apollo.MutationResult<MultipleUploadMutation>;
export type MultipleUploadMutationOptions = Apollo.BaseMutationOptions<MultipleUploadMutation, MultipleUploadMutationVariables>;
export const AddMessageDocument = gql`
    mutation AddMessage($input: AddMessageInput!) {
  addMessage(input: $input) {
    ...MessageModel
  }
}
    ${MessageModelFragmentDoc}`;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
export const SignUpDocument = gql`
    mutation signUp($input: SignUpInput!) {
  signUp(input: $input) {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const LoginDocument = gql`
    mutation login($input: LoginInput!) {
  login(input: $input) {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation updateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const ChatsDocument = gql`
    query Chats($lastId: ID, $count: Int, $lastCreatedAt: Timestamp) {
  chats(lastId: $lastId, count: $count, lastCreatedAt: $lastCreatedAt) {
    chats {
      ...ChatModel
    }
    hasMore
  }
}
    ${ChatModelFragmentDoc}`;

/**
 * __useChatsQuery__
 *
 * To run a query within a React component, call `useChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatsQuery({
 *   variables: {
 *      lastId: // value for 'lastId'
 *      count: // value for 'count'
 *      lastCreatedAt: // value for 'lastCreatedAt'
 *   },
 * });
 */
export function useChatsQuery(baseOptions?: Apollo.QueryHookOptions<ChatsQuery, ChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatsQuery, ChatsQueryVariables>(ChatsDocument, options);
      }
export function useChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatsQuery, ChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatsQuery, ChatsQueryVariables>(ChatsDocument, options);
        }
export type ChatsQueryHookResult = ReturnType<typeof useChatsQuery>;
export type ChatsLazyQueryHookResult = ReturnType<typeof useChatsLazyQuery>;
export type ChatsQueryResult = Apollo.QueryResult<ChatsQuery, ChatsQueryVariables>;
export const SearchChatsDocument = gql`
    query SearchChats($lastId: ID, $count: Int, $lastCreatedAt: Timestamp, $name: String) {
  searchChats(
    lastId: $lastId
    count: $count
    lastCreatedAt: $lastCreatedAt
    name: $name
  ) {
    chats {
      ...ChatModel
    }
    hasMore
  }
}
    ${ChatModelFragmentDoc}`;

/**
 * __useSearchChatsQuery__
 *
 * To run a query within a React component, call `useSearchChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchChatsQuery({
 *   variables: {
 *      lastId: // value for 'lastId'
 *      count: // value for 'count'
 *      lastCreatedAt: // value for 'lastCreatedAt'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchChatsQuery(baseOptions?: Apollo.QueryHookOptions<SearchChatsQuery, SearchChatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchChatsQuery, SearchChatsQueryVariables>(SearchChatsDocument, options);
      }
export function useSearchChatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchChatsQuery, SearchChatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchChatsQuery, SearchChatsQueryVariables>(SearchChatsDocument, options);
        }
export type SearchChatsQueryHookResult = ReturnType<typeof useSearchChatsQuery>;
export type SearchChatsLazyQueryHookResult = ReturnType<typeof useSearchChatsLazyQuery>;
export type SearchChatsQueryResult = Apollo.QueryResult<SearchChatsQuery, SearchChatsQueryVariables>;
export const ChatDocument = gql`
    query Chat($id: ID!) {
  chat(id: $id) {
    ...FullChatModel
  }
}
    ${FullChatModelFragmentDoc}`;

/**
 * __useChatQuery__
 *
 * To run a query within a React component, call `useChatQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChatQuery(baseOptions: Apollo.QueryHookOptions<ChatQuery, ChatQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatQuery, ChatQueryVariables>(ChatDocument, options);
      }
export function useChatLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatQuery, ChatQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatQuery, ChatQueryVariables>(ChatDocument, options);
        }
export type ChatQueryHookResult = ReturnType<typeof useChatQuery>;
export type ChatLazyQueryHookResult = ReturnType<typeof useChatLazyQuery>;
export type ChatQueryResult = Apollo.QueryResult<ChatQuery, ChatQueryVariables>;
export const CheckInviteDocument = gql`
    query CheckInvite($token: String!) {
  checkInvite(token: $token)
}
    `;

/**
 * __useCheckInviteQuery__
 *
 * To run a query within a React component, call `useCheckInviteQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckInviteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckInviteQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useCheckInviteQuery(baseOptions: Apollo.QueryHookOptions<CheckInviteQuery, CheckInviteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckInviteQuery, CheckInviteQueryVariables>(CheckInviteDocument, options);
      }
export function useCheckInviteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckInviteQuery, CheckInviteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckInviteQuery, CheckInviteQueryVariables>(CheckInviteDocument, options);
        }
export type CheckInviteQueryHookResult = ReturnType<typeof useCheckInviteQuery>;
export type CheckInviteLazyQueryHookResult = ReturnType<typeof useCheckInviteLazyQuery>;
export type CheckInviteQueryResult = Apollo.QueryResult<CheckInviteQuery, CheckInviteQueryVariables>;
export const ChatUsersDocument = gql`
    query ChatUsers($chatId: ID!, $lastUserId: ID, $count: Int, $lastCreatedAt: Timestamp) {
  chatUsers(
    chatId: $chatId
    lastUserId: $lastUserId
    count: $count
    lastCreatedAt: $lastCreatedAt
  ) {
    chatUsers {
      ...ChatUserModel
    }
    hasMore
  }
}
    ${ChatUserModelFragmentDoc}`;

/**
 * __useChatUsersQuery__
 *
 * To run a query within a React component, call `useChatUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUsersQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      lastUserId: // value for 'lastUserId'
 *      count: // value for 'count'
 *      lastCreatedAt: // value for 'lastCreatedAt'
 *   },
 * });
 */
export function useChatUsersQuery(baseOptions: Apollo.QueryHookOptions<ChatUsersQuery, ChatUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatUsersQuery, ChatUsersQueryVariables>(ChatUsersDocument, options);
      }
export function useChatUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatUsersQuery, ChatUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatUsersQuery, ChatUsersQueryVariables>(ChatUsersDocument, options);
        }
export type ChatUsersQueryHookResult = ReturnType<typeof useChatUsersQuery>;
export type ChatUsersLazyQueryHookResult = ReturnType<typeof useChatUsersLazyQuery>;
export type ChatUsersQueryResult = Apollo.QueryResult<ChatUsersQuery, ChatUsersQueryVariables>;
export const ChatUserDocument = gql`
    query ChatUser($chatId: ID!, $userId: ID!) {
  chatUser(chatId: $chatId, userId: $userId) {
    ...ChatUserModel
  }
}
    ${ChatUserModelFragmentDoc}`;

/**
 * __useChatUserQuery__
 *
 * To run a query within a React component, call `useChatUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUserQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChatUserQuery(baseOptions: Apollo.QueryHookOptions<ChatUserQuery, ChatUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatUserQuery, ChatUserQueryVariables>(ChatUserDocument, options);
      }
export function useChatUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatUserQuery, ChatUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatUserQuery, ChatUserQueryVariables>(ChatUserDocument, options);
        }
export type ChatUserQueryHookResult = ReturnType<typeof useChatUserQuery>;
export type ChatUserLazyQueryHookResult = ReturnType<typeof useChatUserLazyQuery>;
export type ChatUserQueryResult = Apollo.QueryResult<ChatUserQuery, ChatUserQueryVariables>;
export const MessagesDocument = gql`
    query Messages($chatId: ID!, $lastId: ID, $lastCreatedAt: Timestamp, $count: Int) {
  messages(
    chatId: $chatId
    lastId: $lastId
    lastCreatedAt: $lastCreatedAt
    count: $count
  ) {
    messages {
      ...MessageModel
    }
    hasMore
  }
}
    ${MessageModelFragmentDoc}`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      lastId: // value for 'lastId'
 *      lastCreatedAt: // value for 'lastCreatedAt'
 *      count: // value for 'count'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const MessageDocument = gql`
    query Message($id: ID!) {
  message(id: $id) {
    ...MessageModel
  }
}
    ${MessageModelFragmentDoc}`;

/**
 * __useMessageQuery__
 *
 * To run a query within a React component, call `useMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMessageQuery(baseOptions: Apollo.QueryHookOptions<MessageQuery, MessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessageQuery, MessageQueryVariables>(MessageDocument, options);
      }
export function useMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessageQuery, MessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessageQuery, MessageQueryVariables>(MessageDocument, options);
        }
export type MessageQueryHookResult = ReturnType<typeof useMessageQuery>;
export type MessageLazyQueryHookResult = ReturnType<typeof useMessageLazyQuery>;
export type MessageQueryResult = Apollo.QueryResult<MessageQuery, MessageQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserDocument = gql`
    query User($id: ID!) {
  user(id: $id) {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const ChatAddedDocument = gql`
    subscription ChatAdded($userId: ID!) {
  chatAdded(userId: $userId) {
    ...ChatModel
  }
}
    ${ChatModelFragmentDoc}`;

/**
 * __useChatAddedSubscription__
 *
 * To run a query within a React component, call `useChatAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatAddedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChatAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatAddedSubscription, ChatAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatAddedSubscription, ChatAddedSubscriptionVariables>(ChatAddedDocument, options);
      }
export type ChatAddedSubscriptionHookResult = ReturnType<typeof useChatAddedSubscription>;
export type ChatAddedSubscriptionResult = Apollo.SubscriptionResult<ChatAddedSubscription>;
export const ChatUpdatedDocument = gql`
    subscription ChatUpdated($chatId: ID!) {
  chatUpdated(chatId: $chatId) {
    ...ChatModel
  }
}
    ${ChatModelFragmentDoc}`;

/**
 * __useChatUpdatedSubscription__
 *
 * To run a query within a React component, call `useChatUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUpdatedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatUpdatedSubscription, ChatUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatUpdatedSubscription, ChatUpdatedSubscriptionVariables>(ChatUpdatedDocument, options);
      }
export type ChatUpdatedSubscriptionHookResult = ReturnType<typeof useChatUpdatedSubscription>;
export type ChatUpdatedSubscriptionResult = Apollo.SubscriptionResult<ChatUpdatedSubscription>;
export const ChatRemovedDocument = gql`
    subscription ChatRemoved($chatId: ID!) {
  chatRemoved(chatId: $chatId) {
    id
  }
}
    `;

/**
 * __useChatRemovedSubscription__
 *
 * To run a query within a React component, call `useChatRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatRemovedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatRemovedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatRemovedSubscription, ChatRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatRemovedSubscription, ChatRemovedSubscriptionVariables>(ChatRemovedDocument, options);
      }
export type ChatRemovedSubscriptionHookResult = ReturnType<typeof useChatRemovedSubscription>;
export type ChatRemovedSubscriptionResult = Apollo.SubscriptionResult<ChatRemovedSubscription>;
export const ChatJoinedDocument = gql`
    subscription ChatJoined($userId: ID!) {
  chatJoined(userId: $userId) {
    ...ChatModel
  }
}
    ${ChatModelFragmentDoc}`;

/**
 * __useChatJoinedSubscription__
 *
 * To run a query within a React component, call `useChatJoinedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatJoinedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatJoinedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChatJoinedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatJoinedSubscription, ChatJoinedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatJoinedSubscription, ChatJoinedSubscriptionVariables>(ChatJoinedDocument, options);
      }
export type ChatJoinedSubscriptionHookResult = ReturnType<typeof useChatJoinedSubscription>;
export type ChatJoinedSubscriptionResult = Apollo.SubscriptionResult<ChatJoinedSubscription>;
export const ChatLeavedDocument = gql`
    subscription ChatLeaved($userId: ID!) {
  chatLeaved(userId: $userId) {
    id
  }
}
    `;

/**
 * __useChatLeavedSubscription__
 *
 * To run a query within a React component, call `useChatLeavedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatLeavedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatLeavedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChatLeavedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatLeavedSubscription, ChatLeavedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatLeavedSubscription, ChatLeavedSubscriptionVariables>(ChatLeavedDocument, options);
      }
export type ChatLeavedSubscriptionHookResult = ReturnType<typeof useChatLeavedSubscription>;
export type ChatLeavedSubscriptionResult = Apollo.SubscriptionResult<ChatLeavedSubscription>;
export const ChatInviteAddedDocument = gql`
    subscription ChatInviteAdded($chatId: ID!) {
  chatInviteAdded(chatId: $chatId) {
    ...ChatInviteModel
  }
}
    ${ChatInviteModelFragmentDoc}`;

/**
 * __useChatInviteAddedSubscription__
 *
 * To run a query within a React component, call `useChatInviteAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatInviteAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatInviteAddedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatInviteAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatInviteAddedSubscription, ChatInviteAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatInviteAddedSubscription, ChatInviteAddedSubscriptionVariables>(ChatInviteAddedDocument, options);
      }
export type ChatInviteAddedSubscriptionHookResult = ReturnType<typeof useChatInviteAddedSubscription>;
export type ChatInviteAddedSubscriptionResult = Apollo.SubscriptionResult<ChatInviteAddedSubscription>;
export const ChatInviteUpdatedDocument = gql`
    subscription ChatInviteUpdated($chatId: ID!) {
  chatInviteUpdated(chatId: $chatId) {
    ...ChatInviteModel
  }
}
    ${ChatInviteModelFragmentDoc}`;

/**
 * __useChatInviteUpdatedSubscription__
 *
 * To run a query within a React component, call `useChatInviteUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatInviteUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatInviteUpdatedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatInviteUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatInviteUpdatedSubscription, ChatInviteUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatInviteUpdatedSubscription, ChatInviteUpdatedSubscriptionVariables>(ChatInviteUpdatedDocument, options);
      }
export type ChatInviteUpdatedSubscriptionHookResult = ReturnType<typeof useChatInviteUpdatedSubscription>;
export type ChatInviteUpdatedSubscriptionResult = Apollo.SubscriptionResult<ChatInviteUpdatedSubscription>;
export const ChatInviteRemovedDocument = gql`
    subscription ChatInviteRemoved($chatId: ID!) {
  chatInviteRemoved(chatId: $chatId) {
    ...ChatInviteModel
  }
}
    ${ChatInviteModelFragmentDoc}`;

/**
 * __useChatInviteRemovedSubscription__
 *
 * To run a query within a React component, call `useChatInviteRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatInviteRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatInviteRemovedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatInviteRemovedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatInviteRemovedSubscription, ChatInviteRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatInviteRemovedSubscription, ChatInviteRemovedSubscriptionVariables>(ChatInviteRemovedDocument, options);
      }
export type ChatInviteRemovedSubscriptionHookResult = ReturnType<typeof useChatInviteRemovedSubscription>;
export type ChatInviteRemovedSubscriptionResult = Apollo.SubscriptionResult<ChatInviteRemovedSubscription>;
export const ChatUserJoinedDocument = gql`
    subscription ChatUserJoined($chatId: ID!) {
  chatUserJoined(chatId: $chatId) {
    ...ChatUserModel
  }
}
    ${ChatUserModelFragmentDoc}`;

/**
 * __useChatUserJoinedSubscription__
 *
 * To run a query within a React component, call `useChatUserJoinedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatUserJoinedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUserJoinedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatUserJoinedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatUserJoinedSubscription, ChatUserJoinedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatUserJoinedSubscription, ChatUserJoinedSubscriptionVariables>(ChatUserJoinedDocument, options);
      }
export type ChatUserJoinedSubscriptionHookResult = ReturnType<typeof useChatUserJoinedSubscription>;
export type ChatUserJoinedSubscriptionResult = Apollo.SubscriptionResult<ChatUserJoinedSubscription>;
export const ChatUserLeavedDocument = gql`
    subscription ChatUserLeaved($chatId: ID!) {
  chatUserLeaved(chatId: $chatId) {
    user {
      id
    }
    chat {
      id
    }
  }
}
    `;

/**
 * __useChatUserLeavedSubscription__
 *
 * To run a query within a React component, call `useChatUserLeavedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatUserLeavedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUserLeavedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatUserLeavedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatUserLeavedSubscription, ChatUserLeavedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatUserLeavedSubscription, ChatUserLeavedSubscriptionVariables>(ChatUserLeavedDocument, options);
      }
export type ChatUserLeavedSubscriptionHookResult = ReturnType<typeof useChatUserLeavedSubscription>;
export type ChatUserLeavedSubscriptionResult = Apollo.SubscriptionResult<ChatUserLeavedSubscription>;
export const ChatUserUpdatedDocument = gql`
    subscription ChatUserUpdated($chatId: ID!) {
  chatUserUpdated(chatId: $chatId) {
    ...ChatUserModel
  }
}
    ${ChatUserModelFragmentDoc}`;

/**
 * __useChatUserUpdatedSubscription__
 *
 * To run a query within a React component, call `useChatUserUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatUserUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUserUpdatedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatUserUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatUserUpdatedSubscription, ChatUserUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatUserUpdatedSubscription, ChatUserUpdatedSubscriptionVariables>(ChatUserUpdatedDocument, options);
      }
export type ChatUserUpdatedSubscriptionHookResult = ReturnType<typeof useChatUserUpdatedSubscription>;
export type ChatUserUpdatedSubscriptionResult = Apollo.SubscriptionResult<ChatUserUpdatedSubscription>;
export const LastSeenChangedDocument = gql`
    subscription LastSeenChanged($userId: ID!) {
  lastSeenChanged(userId: $userId) {
    chat {
      id
    }
    lastSeen
  }
}
    `;

/**
 * __useLastSeenChangedSubscription__
 *
 * To run a query within a React component, call `useLastSeenChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLastSeenChangedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastSeenChangedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useLastSeenChangedSubscription(baseOptions: Apollo.SubscriptionHookOptions<LastSeenChangedSubscription, LastSeenChangedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<LastSeenChangedSubscription, LastSeenChangedSubscriptionVariables>(LastSeenChangedDocument, options);
      }
export type LastSeenChangedSubscriptionHookResult = ReturnType<typeof useLastSeenChangedSubscription>;
export type LastSeenChangedSubscriptionResult = Apollo.SubscriptionResult<LastSeenChangedSubscription>;
export const MessageAddedDocument = gql`
    subscription MessageAdded($chatId: ID!) {
  messageAdded(chatId: $chatId) {
    ...MessageModel
  }
}
    ${MessageModelFragmentDoc}`;

/**
 * __useMessageAddedSubscription__
 *
 * To run a query within a React component, call `useMessageAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageAddedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useMessageAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageAddedSubscription, MessageAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageAddedSubscription, MessageAddedSubscriptionVariables>(MessageAddedDocument, options);
      }
export type MessageAddedSubscriptionHookResult = ReturnType<typeof useMessageAddedSubscription>;
export type MessageAddedSubscriptionResult = Apollo.SubscriptionResult<MessageAddedSubscription>;
export const MessageRemovedDocument = gql`
    subscription MessageRemoved($chatId: ID!) {
  messageRemoved(chatId: $chatId) {
    id
    chat {
      id
    }
  }
}
    `;

/**
 * __useMessageRemovedSubscription__
 *
 * To run a query within a React component, call `useMessageRemovedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageRemovedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageRemovedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useMessageRemovedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageRemovedSubscription, MessageRemovedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageRemovedSubscription, MessageRemovedSubscriptionVariables>(MessageRemovedDocument, options);
      }
export type MessageRemovedSubscriptionHookResult = ReturnType<typeof useMessageRemovedSubscription>;
export type MessageRemovedSubscriptionResult = Apollo.SubscriptionResult<MessageRemovedSubscription>;
export const ProfileUpdatedDocument = gql`
    subscription ProfileUpdated($userId: ID!) {
  profileUpdated(userId: $userId) {
    ...UserModel
  }
}
    ${UserModelFragmentDoc}`;

/**
 * __useProfileUpdatedSubscription__
 *
 * To run a query within a React component, call `useProfileUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useProfileUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileUpdatedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useProfileUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ProfileUpdatedSubscription, ProfileUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ProfileUpdatedSubscription, ProfileUpdatedSubscriptionVariables>(ProfileUpdatedDocument, options);
      }
export type ProfileUpdatedSubscriptionHookResult = ReturnType<typeof useProfileUpdatedSubscription>;
export type ProfileUpdatedSubscriptionResult = Apollo.SubscriptionResult<ProfileUpdatedSubscription>;
