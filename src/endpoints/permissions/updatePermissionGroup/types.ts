import {IBaseContext} from '../../contexts/IBaseContext';
import {IPermissionGroupInput} from '../../contexts/data/permission/type';
import {Endpoint} from '../../types';
import {IPublicPermissionGroup} from '../types';

export interface IUpdatePermissionGroupEndpointParameters {
  permissionGroupId: string;
  permissionGroup: IPermissionGroupInput;
}

export interface IUpdatePermissionGroupEndpointResult {
  permissionGroup: IPublicPermissionGroup;
}

export type UpdatePermissionGroupEndpoint = Endpoint<
  IBaseContext,
  IUpdatePermissionGroupEndpointParameters,
  IUpdatePermissionGroupEndpointResult
>;
