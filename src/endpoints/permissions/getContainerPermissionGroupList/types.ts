import {IPermissionGroupContainer} from '../../../mongo/access-control/permissionGroup';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint, IEndpointQueryPaginationOptions, IPaginatedResult} from '../../types';
import {IPublicPermissionGroup} from '../types';

export interface IGetContainerPermissionGroupListEndpointParameters
  extends IEndpointQueryPaginationOptions {
  workspaceId: string;
  container: IPermissionGroupContainer;
}

export interface IGetContainerPermissionGroupListEndpointResult extends IPaginatedResult {
  permissionGroups: IPublicPermissionGroup[];
}

export type GetContainerPermissionGroupListEndpoint = Endpoint<
  IBaseContext,
  IGetContainerPermissionGroupListEndpointParameters,
  IGetContainerPermissionGroupListEndpointResult
>;
