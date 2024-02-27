import {
  IPermissionGroup,
  IPermissionGroupContainer,
} from '../../../../mongo/access-control/permissionGroup';
import {
  IPermissionItem,
  IPermissionItemCondition,
  IPermissionItemEntity,
  IPermissionItemTarget,
  SoftkavePermissionActions,
} from '../../../../mongo/access-control/permissionItem';
import {DataQuery, IBaseDataProvider} from '../types';

export interface IPermissionItemInput {
  entity: IPermissionItemEntity;
  action: SoftkavePermissionActions;
  target: IPermissionItemTarget;
  conditions: IPermissionItemCondition[];
  allow: boolean;
}

export interface IAssignedPermissionGroupInput {
  permissionGroupId: string;
  order: number;
}

export interface IPermissionGroupInput {
  name: string;
  container: IPermissionGroupContainer;
  description?: string;
}

export type IPermissionItemQuery = DataQuery<IPermissionItem>;
export type IPermissionItemDataProvider = IBaseDataProvider<IPermissionItem>;

export type IPermissionGroupQuery = DataQuery<IPermissionGroup>;
export type IPermissionGroupDataProvider = IBaseDataProvider<IPermissionGroup>;
