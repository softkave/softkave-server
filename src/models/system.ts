import {reverseMap} from '../utilities/fns';

export const SYSTEM_NAME = 'system';
export enum SystemResourceType {
  All = '*',
  User = 'user',
  AnonymousUser = 'anonymousUser',
  Client = 'client',
  Workspace = 'workspace',
  Board = 'board',
  Task = 'task',
  Status = 'status',
  Label = 'label',
  TaskResolution = 'taskResolution',
  Note = 'note',
  Comment = 'comment',
  ChatRoom = 'room',
  Sprint = 'sprint',
  Chat = 'chat',
  SubTask = 'subtask',
  CollaborationRequest = 'collaborationRequest',
  PermissionItem = 'permissionItem',
  PermissionGroup = 'permissionGroup',
  Notification = 'notification',
  CustomProperty = 'customProperty',
  CustomValue = 'customValue',
  PushSubscription = 'pushSub',

  UserToken = 'userToken',
  AuditLog = 'auditLog',
  EndpointRequest = 'endpointRequest',
  Eav = 'eav',
  UnseenChats = 'unseenChats',
}

export const resourceTypeShortNameMaxLen = 7;
function padShortName(shortName: string) {
  const pad0 = '0';
  if (shortName.length > resourceTypeShortNameMaxLen) {
    throw new Error(`Resource short name is more than ${resourceTypeShortNameMaxLen} characters`);
  }
  return shortName.padEnd(resourceTypeShortNameMaxLen, pad0).toLowerCase();
}

export const resourceTypeShortNames: Record<SystemResourceType, string> = {
  // [SystemResourceType.System]: padShortName('system'),
  // [SystemResourceType.Public]: padShortName('public'),

  [SystemResourceType.All]: padShortName('*'),
  [SystemResourceType.Workspace]: padShortName('wrkspce'),
  [SystemResourceType.PermissionGroup]: padShortName('pmgroup'),
  [SystemResourceType.User]: padShortName('user'),
  [SystemResourceType.AnonymousUser]: padShortName('anymusr'),
  [SystemResourceType.Client]: padShortName('client'),
  [SystemResourceType.Board]: padShortName('board'),
  [SystemResourceType.Task]: padShortName('task'),
  [SystemResourceType.Status]: padShortName('status'),
  [SystemResourceType.Label]: padShortName('label'),
  [SystemResourceType.TaskResolution]: padShortName('tskrsln'),
  [SystemResourceType.Note]: padShortName('note'),
  [SystemResourceType.Comment]: padShortName('commnt'),
  [SystemResourceType.ChatRoom]: padShortName('chtroom'),
  [SystemResourceType.Sprint]: padShortName('sprnt'),
  [SystemResourceType.Chat]: padShortName('chat'),
  [SystemResourceType.SubTask]: padShortName('sbtask'),
  [SystemResourceType.CollaborationRequest]: padShortName('corqst'),
  [SystemResourceType.Notification]: padShortName('notftn'),
  [SystemResourceType.CustomProperty]: padShortName('cstmpty'),
  [SystemResourceType.CustomValue]: padShortName('cstmval'),
  [SystemResourceType.PushSubscription]: padShortName('pushsub'),
  [SystemResourceType.PermissionItem]: padShortName('permitm'),

  [SystemResourceType.EndpointRequest]: padShortName('endrqst'),
  [SystemResourceType.UnseenChats]: padShortName('unsncht'),
  [SystemResourceType.AuditLog]: padShortName('audlog'),
  [SystemResourceType.Eav]: padShortName('eav'),
  [SystemResourceType.UserToken]: padShortName('usertn'),
};

export const shortNameToResourceTypeMap = reverseMap(resourceTypeShortNames);

export enum SystemActionType {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum ClientType {
  Browser = 'browser',
}
