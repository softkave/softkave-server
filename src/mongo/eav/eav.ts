import {AnyObject, Connection, SchemaTypes} from 'mongoose';
import {IResource} from '../../models/resource';
import {SystemResourceType} from '../../models/system';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {IPermissionGroupContainer} from '../access-control/permissionGroup';
import {IPermissionItemEntity} from '../access-control/permissionItem';
import {getDefaultMongoConnection} from '../defaultConnection';
import {resourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export const eavV1 = 1;

export enum EavAttributes {
  AssignedPermissionGroup = 'assignedPermissionGroup',
  PublicPermissionGroup = 'publicPermissionGroup',
}

export interface IEav<V extends AnyObject = AnyObject, Meta extends AnyObject = AnyObject>
  extends IResource {
  entityId: string;
  entityType: SystemResourceType;
  attribute: EavAttributes;
  value: V;
  meta?: Meta;
  workspaceId?: string;
  createdBy?: string;
}

export interface IEavAssignedPermissionGroupValue
  extends IPermissionItemEntity,
    IPermissionGroupContainer {
  permissionGroupId: string;
  assignedAt: Date | string;
  assignedBy: string;
  order: number;
}

export interface IEavOrgPublicPermissionGroupValue {
  permissionGroupId: string;
}

export type IEavAssignedPermissionGroup = IEav<IEavAssignedPermissionGroupValue>;
export type IEavOrganizationPermissionGroup = IEav<IEavOrgPublicPermissionGroupValue>;

const eavSchema = ensureMongoSchemaFields<IEav>({
  ...resourceSchema,
  workspaceId: {type: String, index: true},
  createdBy: {type: String, index: true},
  entityId: {type: String, index: true},
  entityType: {type: String, index: true},
  attribute: {type: String, index: true},
  value: {type: SchemaTypes.Map, index: true},
  meta: {type: SchemaTypes.Map},
});

const modelName = 'eav_01';
const collectionName = 'eavs_01';
export const getEavModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IEav>({
      modelName,
      collectionName,
      rawSchema: eavSchema,
      connection: conn,
    });
  }
);

export type IEavModel = MongoModel<IEav>;
