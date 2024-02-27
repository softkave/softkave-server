import {Connection, SchemaTypes} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import {SystemResourceType} from '../../models/system';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export type PermissionItemConditionOn = 'target' | 'action-target' | 'entity' | 'action-entity';
export type PermissionItemConditionResourceFields =
  | 'createdBy'
  | 'visibility'
  | 'customId'
  | 'is-author';
export type PermissionItemConditionTaskFields = 'is-assigned';
export type PermissionItemConditionFields =
  | PermissionItemConditionResourceFields
  | PermissionItemConditionTaskFields;

export interface IPermissionItemCondition {
  field: PermissionItemConditionFields;
  on: PermissionItemConditionOn;
  is: any;
  actionTargetType?: SystemResourceType[];
  actionEntityType?: SystemResourceType[];
}

export interface IPermissionItemEntity {
  entityType: SystemResourceType;
  entityId: string;
}
export type PermissionItemAction = string;
export interface IPermissionItemTarget {
  containerId: string;
  containerType: SystemResourceType;
  targetType: SystemResourceType;
  targetId: string;
}

export type SoftkavePermissionActions_Org = 'create-org' | 'update-org' | 'read-org' | 'delete-org';
export type SoftkavePermissionActions_Board =
  | 'create-board'
  | 'update-board'
  | 'read-board'
  | 'delete-board';
export type SoftkavePermissionActions_Task =
  | 'create-task'
  | 'update-task'
  | 'read-task'
  | 'delete-task'
  | 'toggle-task'
  | 'transfer-task'
  | 'create-subtask'
  | 'update-subtask'
  | 'delete-subtask'
  | 'toggle-subtask';
export type SoftkavePermissionActions_Permissions =
  | 'create-permission-group'
  | 'update-permission-group'
  | 'read-permission-group'
  | 'delete-permission-group'
  | 'assign-permission'
  | 'update-permissions';
export type SoftkavePermissionActions_Chat = 'chat' | 'create-chat-room';
export type SoftkavePermissionActions_Collaborator =
  | 'invite-collaborator'
  | 'read-request'
  | 'revoke-request'
  | 'update-request'
  | 'remove-collaborator'
  | 'read-collaborator';
export type SoftkavePermissionActions_Sprint =
  | 'create-sprint'
  | 'read-sprint'
  | 'update-sprint'
  | 'delete-sprint'
  | 'start-sprint'
  | 'end-sprint';
export type SoftkavePermissionActions =
  | '*'
  | SoftkavePermissionActions_Org
  | SoftkavePermissionActions_Board
  | SoftkavePermissionActions_Task
  | SoftkavePermissionActions_Chat
  | SoftkavePermissionActions_Collaborator
  | SoftkavePermissionActions_Permissions
  | SoftkavePermissionActions_Sprint;

export const softkaveActionsList = [
  'create-org',
  'update-org',
  'read-org',
  'delete-org',

  'create-board',
  'update-board',
  'read-board',
  'delete-board',

  'create-task',
  'update-task',
  'read-task',
  'delete-task',
  'toggle-task',
  'transfer-task',
  'create-subtask',
  'update-subtask',
  'delete-subtask',
  'toggle-subtask',

  'create-permission-group',
  'update-permission-group',
  'read-permission-group',
  'delete-permission-group',
  'assign-permission',
  'update-permissions',

  'chat',
  'create-chat-room',

  'invite-collaborator',
  'read-request',
  'revoke-request',
  'update-request',
  'remove-collaborator',
  'read-collaborator',

  'create-sprint',
  'read-sprint',
  'update-sprint',
  'delete-sprint',
  'start-sprint',
  'end-sprint',

  '*',
];

export interface IPermissionItem extends IWorkspaceResource {
  workspaceId: string;
  createdAt: Date | string;
  createdBy: string;
  entity: IPermissionItemEntity;
  action: SoftkavePermissionActions;
  target: IPermissionItemTarget;
  conditions: IPermissionItemCondition[];
  allow: boolean;
}

const permissionItemConditionSchema = ensureMongoSchemaFields<IPermissionItemCondition>({
  field: {type: String},
  is: {type: SchemaTypes.Mixed},
  on: {type: String},
  actionTargetType: {type: [String]},
  actionEntityType: {type: [String]},
});
const permissionItemEntitySchema = ensureMongoSchemaFields<IPermissionItemEntity>({
  entityType: {type: String, index: true},
  entityId: {type: String, index: true},
});
const permissionItemTargetSchema = ensureMongoSchemaFields<IPermissionItemTarget>({
  containerType: {type: String, index: true},
  containerId: {type: String, index: true},
  targetType: {type: String, index: true},
  targetId: {type: String, index: true},
});
const permissionItemSchema = ensureMongoSchemaFields<IPermissionItem>({
  entity: {type: permissionItemEntitySchema, index: true},
  action: {type: String, index: true},
  target: {type: permissionItemTargetSchema},
  conditions: {type: [permissionItemConditionSchema], index: true},
  allow: {type: Boolean, index: true},
  ...workspaceResourceSchema,
});

const modelName = 'permission_item_01';
const collectionName = 'permission_items_01';
export const getPermissionItemModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IPermissionItem>({
      modelName,
      collectionName,
      rawSchema: permissionItemSchema,
      connection: conn,
    });
  }
);

export type IPermissionItemModel = MongoModel<IPermissionItem>;
