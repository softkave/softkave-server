import {first, get, isFunction, isString, last} from 'lodash';
import {Connection} from 'mongoose';
import {ClientType, SystemResourceType, resourceTypeShortNames} from '../models/system';
import MongoModel from '../mongo/MongoModel';
import {getBlockModel} from '../mongo/block/BlockModel';
import {IBoard, getBoardModel} from '../mongo/block/board';
import {BlockType, IBlock} from '../mongo/block/definitions';
import {ITask, getTaskModel} from '../mongo/block/task';
import {IWorkspace, getWorkspaceModel} from '../mongo/block/workspace';
import {IChat, getChatModel} from '../mongo/chat/definitions';
import {
  IClient,
  IClientPushNotificationKeys,
  IClientUserEntry,
  getClientModel,
} from '../mongo/client/definitions';
import {
  ICollaborationRequest,
  ICollaborationRequestRecipient,
  ICollaborationRequestSentEmailHistoryItem,
  ICollaborationRequestStatus,
  getCollaborationRequestModel,
} from '../mongo/collaboration-request/definitions';
import {IChatRoom, IChatRoomMemberReadCounter, getChatRoomModel} from '../mongo/room/definitions';
import {ISprint, SprintDuration, getSprintModel} from '../mongo/sprint/definitions';
import {IToken, getTokenModel} from '../mongo/token/definitions';
import {IUnseenChats, getUnseenChatsModel} from '../mongo/unseen-chats/definitions';
import {IUser, IUserOrganization, getUserModel} from '../mongo/user/definitions';
import {kIdSeperator} from '../utilities/ids';
import logger from '../utilities/logger';
import {AnyFn} from '../utilities/types';
import assert = require('assert');

interface Old_IChat {
  customId: string;
  orgId: string;
  message: string;
  sender: string;
  roomId: string;
  createdAt: Date;
  updatedAt?: Date;
}
interface Old_IClient {
  clientId: string;
  createdAt: string;
  clientType: ClientType;
  users: Array<IClientUserEntry>;
  endpoint?: string | null;
  keys?: IClientPushNotificationKeys | null;
  pushSubscribedAt?: string;
}
interface Old_ICollaborationRequest {
  customId: string;
  to: ICollaborationRequestRecipient;
  title: string;
  body?: string;
  from: {
    userId: string;
    name: string;
    blockId: string;
    blockName: string;
    blockType: BlockType;
  };
  createdAt: Date;
  expiresAt?: Date;
  readAt?: Date;
  statusHistory: Array<ICollaborationRequestStatus>;
  sentEmailHistory: Array<ICollaborationRequestSentEmailHistoryItem>;
}
interface Old_IRoom {
  customId: string;
  name: string;
  orgId: string;
  createdAt: Date;
  createdBy: string;
  members: Array<IChatRoomMemberReadCounter>;
  updatedAt?: Date;
  updatedBy?: string;
  lastChatCreatedAt?: Date | string;
}
interface Old_ISprint {
  customId: string;
  boardId: string;
  orgId: string;
  duration: SprintDuration;
  createdAt: Date;
  createdBy: string;
  name: string;
  sprintIndex: number;
  prevSprintId?: string;
  nextSprintId?: string;
  startDate?: Date;
  startedBy?: string;
  endDate?: Date;
  endedBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
interface Old_IToken {
  customId: string;
  userId: string;
  version: number;
  issuedAt: string;
  audience: Array<string>;
  expires?: number;
  meta?: Record<string, string | number | boolean | null>;
  clientId?: string;
}
interface Old_IUnseenChats {
  customId: string;
  userId: string;
  rooms: {[key: string]: number};
  createdAt: string;
}
interface Old_IUser {
  customId: string;
  name: string;
  email: string;
  hash: string;
  createdAt: string | Date;
  forgotPasswordHistory?: Array<string>;
  passwordLastChangedAt?: string | Date;
  rootBlockId: string;
  orgs: Array<IUserOrganization>;
  color: string;
  notificationsLastCheckedAt?: string;
  isAnonymousUser?: boolean;
}

type RR<TOld, TNew> = {
  [K in keyof TNew]: keyof TOld | undefined | AnyFn<[TOld], TNew[K]>;
};

function prefixIdType(resourceType: SystemResourceType, id: string) {
  return `${resourceTypeShortNames[resourceType]}${kIdSeperator}${id}`;
}

const rrChat: RR<Old_IChat, IChat> = {
  customId: c => prefixIdType(SystemResourceType.Chat, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,
  workspaceId: c => prefixIdType(SystemResourceType.Workspace, c.orgId),
  visibility: () => 'organization',
  createdBy: c => prefixIdType(SystemResourceType.User, c.sender),
  lastUpdatedBy: undefined,

  message: 'message',
  roomId: c => prefixIdType(SystemResourceType.ChatRoom, c.roomId),
};
const rrClient: RR<Old_IClient, IClient> = {
  customId: c => prefixIdType(SystemResourceType.Client, c.clientId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,

  clientType: 'clientType',
  users: c =>
    c.users.map(u => ({
      ...u,
      tokenId: prefixIdType(SystemResourceType.UserToken, u.tokenId),
      userId: prefixIdType(SystemResourceType.User, u.userId),
    })),
  endpoint: 'endpoint',
  keys: 'keys',
  pushSubscribedAt: 'pushSubscribedAt',
};
const rrCollaborationRequest: RR<Old_ICollaborationRequest, ICollaborationRequest> = {
  customId: c => prefixIdType(SystemResourceType.CollaborationRequest, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,
  workspaceId: c => {
    return prefixIdType(SystemResourceType.Workspace, c.from.blockId);
  },
  visibility: () => 'organization',
  createdBy: c => prefixIdType(SystemResourceType.User, c.from.userId),
  lastUpdatedBy: undefined,

  to: 'to',
  title: 'title',
  body: 'body',
  from: c => ({
    userId: prefixIdType(SystemResourceType.User, c.from.userId),
    userName: c.from.name,
    workspaceId: prefixIdType(SystemResourceType.Workspace, c.from.blockId),
    workspaceName: c.from.blockName,
  }),
  expiresAt: 'expiresAt',
  readAt: 'readAt',
  statusHistory: 'statusHistory',
  sentEmailHistory: 'sentEmailHistory',
};
const rrRoom: RR<Old_IRoom, IChatRoom> = {
  customId: c => prefixIdType(SystemResourceType.ChatRoom, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,
  workspaceId: c => prefixIdType(SystemResourceType.Workspace, c.orgId),
  visibility: () => 'organization',
  createdBy: c => {
    const id = first(c.members)?.userId;
    assert(id);
    return prefixIdType(SystemResourceType.User, id);
  },
  lastUpdatedBy: undefined,

  name: 'name',
  members: c =>
    c.members.map(m => ({...m, userId: prefixIdType(SystemResourceType.User, m.userId)})),
  lastChatCreatedAt: 'lastChatCreatedAt',
};
const rrSprint: RR<Old_ISprint, ISprint> = {
  customId: c => prefixIdType(SystemResourceType.Sprint, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,
  workspaceId: c => prefixIdType(SystemResourceType.Workspace, c.orgId),
  visibility: () => 'organization',
  createdBy: c => prefixIdType(SystemResourceType.User, c.createdBy),
  lastUpdatedBy: c =>
    c.updatedBy ? prefixIdType(SystemResourceType.User, c.updatedBy) : undefined,

  boardId: c => prefixIdType(SystemResourceType.Board, c.boardId),
  duration: 'duration',
  name: 'name',
  sprintIndex: 'sprintIndex',
  prevSprintId: c =>
    c.prevSprintId ? prefixIdType(SystemResourceType.Sprint, c.prevSprintId) : undefined,
  nextSprintId: c =>
    c.nextSprintId ? prefixIdType(SystemResourceType.Sprint, c.nextSprintId) : undefined,
  startDate: 'startDate',
  startedBy: c => (c.startedBy ? prefixIdType(SystemResourceType.User, c.startedBy) : undefined),
  endDate: 'endDate',
  endedBy: c => (c.endedBy ? prefixIdType(SystemResourceType.User, c.endedBy) : undefined),
};
const rrToken: RR<Old_IToken, IToken> = {
  customId: c => prefixIdType(SystemResourceType.UserToken, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'issuedAt',
  lastUpdatedAt: undefined,

  userId: c => prefixIdType(SystemResourceType.User, c.userId),
  version: 'version',
  audience: 'audience',
  expires: 'expires',
  meta: 'meta',
  clientId: c => (c.clientId ? prefixIdType(SystemResourceType.Client, c.clientId) : undefined),
};
const rrUnseenChats: RR<Old_IUnseenChats, IUnseenChats> = {
  customId: c => prefixIdType(SystemResourceType.UnseenChats, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,

  userId: c => prefixIdType(SystemResourceType.User, c.userId),
  rooms: c => {
    const rm: Record<string, number> = {};
    for (const roomId in c.rooms) {
      rm[prefixIdType(SystemResourceType.ChatRoom, roomId)] = c.rooms[roomId];
    }
    return rm;
  },
};
const rrUser: RR<Old_IUser, IUser> = {
  customId: c => prefixIdType(SystemResourceType.User, c.customId),
  isDeleted: undefined,
  deletedBy: undefined,
  deletedAt: undefined,
  createdAt: 'createdAt',
  lastUpdatedAt: undefined,

  firstName: u => first(u.name.split(' ')) ?? '',
  lastName: u => last(u.name.split(' ')) ?? '',
  email: 'email',
  hash: 'hash',
  forgotPasswordHistory: 'forgotPasswordHistory',
  passwordLastChangedAt: 'passwordLastChangedAt',
  workspaces: c =>
    c.orgs.map(o => ({customId: prefixIdType(SystemResourceType.Workspace, o.customId)})),
  color: 'color',
  notificationsLastCheckedAt: 'notificationsLastCheckedAt',
  isAnonymousUser: 'isAnonymousUser',
};
const rrWorkspace: RR<IBlock, IWorkspace> = {
  customId: c => prefixIdType(SystemResourceType.Workspace, c.customId),
  isDeleted: 'isDeleted',
  deletedBy: c => (c.deletedBy ? prefixIdType(SystemResourceType.User, c.deletedBy) : undefined),
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  lastUpdatedAt: 'updatedAt',
  workspaceId: c => prefixIdType(SystemResourceType.Workspace, c.customId),
  visibility: () => 'organization',
  createdBy: c => prefixIdType(SystemResourceType.User, c.createdBy),
  lastUpdatedBy: c =>
    c.updatedBy ? prefixIdType(SystemResourceType.User, c.updatedBy) : undefined,

  name: 'name',
  description: 'description',
  color: 'color',
  publicPermissionGroupId: c =>
    c.publicPermissionGroupId
      ? prefixIdType(SystemResourceType.PermissionGroup, c.publicPermissionGroupId)
      : undefined,
};
const rrBoard: RR<IBlock, IBoard> = {
  customId: c => prefixIdType(SystemResourceType.Board, c.customId),
  isDeleted: 'isDeleted',
  deletedBy: c => (c.deletedBy ? prefixIdType(SystemResourceType.User, c.deletedBy) : undefined),
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  lastUpdatedAt: 'updatedAt',
  workspaceId: c => {
    assert(c.parent);
    return prefixIdType(SystemResourceType.Workspace, c.parent);
  },
  visibility: () => 'organization',
  createdBy: c => prefixIdType(SystemResourceType.User, c.createdBy),
  lastUpdatedBy: c =>
    c.updatedBy ? prefixIdType(SystemResourceType.User, c.updatedBy) : undefined,

  name: 'name',
  description: 'description',
  color: 'color',
  boardStatuses: c =>
    c.boardStatuses?.map(s => ({
      ...s,
      createdBy: prefixIdType(SystemResourceType.User, s.createdBy),
      updatedBy: s.updatedBy ? prefixIdType(SystemResourceType.User, s.updatedBy) : undefined,
      customId: prefixIdType(SystemResourceType.Status, s.customId),
    })) ?? [],
  boardLabels: c =>
    c.boardLabels?.map(s => ({
      ...s,
      createdBy: prefixIdType(SystemResourceType.User, s.createdBy),
      updatedBy: s.updatedBy ? prefixIdType(SystemResourceType.User, s.updatedBy) : undefined,
      customId: prefixIdType(SystemResourceType.Label, s.customId),
    })) ?? [],
  boardResolutions: c =>
    c.boardLabels?.map(s => ({
      ...s,
      createdBy: prefixIdType(SystemResourceType.User, s.createdBy),
      updatedBy: s.updatedBy ? prefixIdType(SystemResourceType.User, s.updatedBy) : undefined,
      customId: prefixIdType(SystemResourceType.TaskResolution, s.customId),
    })) ?? [],
  currentSprintId: c =>
    c.currentSprintId ? prefixIdType(SystemResourceType.Sprint, c.currentSprintId) : undefined,
  sprintOptions: 'sprintOptions',
  lastSprintId: c =>
    c.lastSprintId ? prefixIdType(SystemResourceType.Sprint, c.lastSprintId) : undefined,
};
const rrTask: RR<IBlock, ITask> = {
  customId: c => prefixIdType(SystemResourceType.Task, c.customId),
  isDeleted: 'isDeleted',
  deletedBy: c => (c.deletedBy ? prefixIdType(SystemResourceType.User, c.deletedBy) : undefined),
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  lastUpdatedAt: 'updatedAt',
  workspaceId: c => {
    assert(c.rootBlockId);
    return prefixIdType(SystemResourceType.Workspace, c.rootBlockId);
  },
  visibility: () => 'organization',
  createdBy: c => prefixIdType(SystemResourceType.User, c.createdBy),
  lastUpdatedBy: c =>
    c.updatedBy ? prefixIdType(SystemResourceType.User, c.updatedBy) : undefined,

  name: 'name',
  description: 'description',
  boardId: c => {
    assert(c.parent);
    return prefixIdType(SystemResourceType.Board, c.parent);
  },
  assignees: c =>
    c.assignees?.map(a => ({
      ...a,
      assignedBy: prefixIdType(SystemResourceType.User, a.assignedBy),
      userId: prefixIdType(SystemResourceType.User, a.userId),
    })) ?? [],
  priority: 'priority',
  subTasks: c =>
    c.subTasks?.map(s => ({
      ...s,
      completedBy: s.completedBy ? prefixIdType(SystemResourceType.User, s.completedBy) : undefined,
      createdBy: prefixIdType(SystemResourceType.User, s.createdBy),
      updatedBy: s.updatedBy ? prefixIdType(SystemResourceType.User, s.updatedBy) : undefined,
      customId: prefixIdType(SystemResourceType.SubTask, s.customId),
    })) ?? [],
  status: c => (c.status ? prefixIdType(SystemResourceType.Status, c.status) : undefined),
  statusAssignedBy: c =>
    c.statusAssignedBy ? prefixIdType(SystemResourceType.User, c.statusAssignedBy) : undefined,
  statusAssignedAt: 'statusAssignedAt',
  taskResolution: c =>
    c.taskResolution
      ? prefixIdType(SystemResourceType.TaskResolution, c.taskResolution)
      : undefined,
  labels: c =>
    c.labels?.map(s => ({
      ...s,
      assignedBy: prefixIdType(SystemResourceType.User, s.assignedBy),
      labelId: prefixIdType(SystemResourceType.Label, s.customId),
    })) ?? [],
  dueAt: 'dueAt',
  taskSprint: c =>
    c.taskSprint
      ? {
          ...c.taskSprint,
          assignedBy: prefixIdType(SystemResourceType.User, c.taskSprint.assignedBy),
          sprintId: prefixIdType(SystemResourceType.Sprint, c.taskSprint.sprintId),
        }
      : undefined,
};

const oldChatModelName = 'chat';
const oldClientModelName = 'client';
const oldCollaborationRequestModelName = 'collaboration-request';
const oldRoomModelName = 'room';
const oldSprintModelName = 'sprint';
const oldTokenModelName = 'token';
const oldUnseenChatsModelName = 'unseen-chat';
const oldUserModelName = 'user-v2';
const oldChatCollectionName = 'chats';
const oldClientCollectionName = 'clients';
const oldCollaborationRequestCollectionName = 'collaboration-requests';
const oldRoomCollectionName = 'rooms';
const oldSprintCollectionName = 'sprints';
const oldTokenCollectionName = 'tokens';
const oldUnseenChatsCollectionName = 'unseen-chats';
const oldUserCollectionName = 'users-v2';

function getOldModel(connection: Connection, modelName: string, collectionName: string) {
  return new MongoModel<any>({
    connection,
    modelName,
    collectionName,
    rawSchema: {},
  });
}

function rrOldToNew<TOld>(oldItem: TOld, rrSchema: RR<TOld, any>) {
  const newItem: any = {};

  for (const newKey in rrSchema) {
    const oldKey = rrSchema[newKey];
    let newValue: any = undefined;

    if (isFunction(oldKey)) {
      newValue = oldKey(oldItem);
    } else if (isString(oldKey)) {
      newValue = get(oldItem, oldKey);
    }

    newItem[newKey] = newValue;
  }

  return newItem;
}
function rrOldListToNewList<TOld>(oldList: TOld[], rrSchema: RR<TOld, any>) {
  return oldList.map(oldItem => rrOldToNew(oldItem, rrSchema));
}
async function rrTransformUsingOldList(
  oldList: any[],
  newModel: MongoModel,
  rrSchema: RR<any, any>
) {
  const newList = rrOldListToNewList(oldList, rrSchema);
  await newModel.model.deleteMany({}).exec();
  await newModel.model.insertMany(newList);
}
async function rrTransformUsingModels(
  oldModel: MongoModel,
  newModel: MongoModel,
  rrSchema: RR<any, any>
) {
  const oldList = await oldModel.model.find({}).lean().exec();
  await rrTransformUsingOldList(oldList, newModel, rrSchema);
}

async function rrTransformChat(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldChatModelName, oldChatCollectionName),
    getChatModel(connection),
    rrChat
  );
}
async function rrTransformClient(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldClientModelName, oldClientCollectionName),
    getClientModel(connection),
    rrClient
  );
}
async function rrTransformCollaborationRequest(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(
      connection,
      oldCollaborationRequestModelName,
      oldCollaborationRequestCollectionName
    ),
    getCollaborationRequestModel(connection),
    rrCollaborationRequest
  );
}
async function rrTransformRoom(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldRoomModelName, oldRoomCollectionName),
    getChatRoomModel(connection),
    rrRoom
  );
}
async function rrTransformSprint(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldSprintModelName, oldSprintCollectionName),
    getSprintModel(connection),
    rrSprint
  );
}
async function rrTransformToken(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldTokenModelName, oldTokenCollectionName),
    getTokenModel(connection),
    rrToken
  );
}
async function rrTransformUser(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldUserModelName, oldUserCollectionName),
    getUserModel(connection),
    rrUser
  );
}
async function rrTransformUnseenChats(connection: Connection) {
  await rrTransformUsingModels(
    getOldModel(connection, oldUnseenChatsModelName, oldUnseenChatsCollectionName),
    getUnseenChatsModel(connection),
    rrUnseenChats
  );
}
async function rrTransformUnseenWorkspaces(connection: Connection) {
  await rrTransformUsingOldList(
    await getBlockModel(connection).model.find({type: BlockType.Organization}).lean().exec(),
    getWorkspaceModel(connection),
    rrWorkspace
  );
}
async function rrTransformBoard(connection: Connection) {
  await rrTransformUsingOldList(
    await getBlockModel(connection).model.find({type: BlockType.Board}).lean().exec(),
    getBoardModel(connection),
    rrBoard
  );
}
async function rrTransformTask(connection: Connection) {
  await rrTransformUsingOldList(
    await getBlockModel(connection).model.find({type: BlockType.Task}).lean().exec(),
    getTaskModel(connection),
    rrTask
  );
}
async function rrTransform(connection: Connection) {
  // We currently don't have that much data so running them in parallel without
  // pagination should be okay
  await Promise.all([
    rrTransformChat(connection),
    rrTransformClient(connection),
    rrTransformCollaborationRequest(connection),
    rrTransformRoom(connection),
    rrTransformSprint(connection),
    rrTransformToken(connection),
    rrTransformUnseenChats(connection),
    rrTransformUser(connection),
    rrTransformUnseenWorkspaces(connection),
    rrTransformBoard(connection),
    rrTransformTask(connection),
  ]);
}

/**
 * **WARNING**: deletes existing data in destination collections.
 */
export async function script_transformResources(connection: Connection) {
  logger.info('script: start transform resources');
  await rrTransform(connection);
  logger.info('script: end transform resources');
}
