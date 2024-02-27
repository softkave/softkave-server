import {IPermissionGroupContainer} from '../../../mongo/access-control/permissionGroup';
import {IPermissionItemEntity} from '../../../mongo/access-control/permissionItem';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPermissionGroupWithAssignedInfo} from '../types';

export interface IGetAssignedPermissionGroupListEndpointParameters {
  organizationId: string;
  container: IPermissionGroupContainer;
  entity: IPermissionItemEntity;
}

export interface IGetAssignedPermissionGroupListEndpointResult {
  permissionGroups: Array<IPermissionGroupWithAssignedInfo>;
}

export type GetAssignedPermissionGroupListEndpoint = Endpoint<
  IBaseContext,
  IGetAssignedPermissionGroupListEndpointParameters,
  IGetAssignedPermissionGroupListEndpointResult
>;
