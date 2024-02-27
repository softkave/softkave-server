import {IResourceWithDescriptor} from '../../../models/resource';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IGetPermissionGroupAssigneesEndpointParameters {
  organizationId: string;
  permissionGroupId: string;
}

// TODO: paginate?
export interface IGetPermissionGroupAssigneesEndpointResult {
  resources: Array<IResourceWithDescriptor<any>>;
}

export type GetPermissionGroupAssigneesEndpoint = Endpoint<
  IBaseContext,
  IGetPermissionGroupAssigneesEndpointParameters,
  IGetPermissionGroupAssigneesEndpointResult
>;
