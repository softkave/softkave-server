import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import {SystemResourceType} from '../../models/system';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export interface IPermissionGroupContainer {
  containerType: SystemResourceType;
  containerId: string;
}

export interface IPermissionGroup extends IWorkspaceResource {
  workspaceId: string;
  container: IPermissionGroupContainer;
  name: string;
  description?: string;
  isSystemManaged?: boolean;
}

const permissionGroupContainerSchema = ensureMongoSchemaFields<IPermissionGroupContainer>({
  containerType: {type: String, index: true},
  containerId: {type: String, index: true},
});
const permissionGroupsSchema = ensureMongoSchemaFields<IPermissionGroup>({
  container: {type: permissionGroupContainerSchema, index: true},
  name: {type: String, index: true},
  description: {type: String},
  isSystemManaged: {type: Boolean},
  ...workspaceResourceSchema,
});

const modelName = 'permission_group_01';
const collectionName = 'permission_groups_01';
export const getPermissionGroupModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IPermissionGroup>({
      modelName,
      collectionName,
      rawSchema: permissionGroupsSchema,
      connection: conn,
    });
  }
);

export type IPermissionGroupModel = MongoModel<IPermissionGroup>;
