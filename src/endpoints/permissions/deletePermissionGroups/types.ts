import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IDeletePermissionGroupsEndpointParameters {
  workspaceId: string;
  permissionGroupIds: string[];
}

export type DeletePermissionGroupsEndpoint = Endpoint<
  IBaseContext,
  IDeletePermissionGroupsEndpointParameters
>;
