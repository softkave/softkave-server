import {IBaseContext} from '../../contexts/IBaseContext';
import {IPermissionGroupInput} from '../../contexts/data/permission/type';
import {Endpoint} from '../../types';
import {IPublicPermissionGroup} from '../types';

export interface ICreatePermissionGroupEndpointParameters {
  organizationId: string;
  permissionGroup: IPermissionGroupInput;
}

export interface ICreatePermissionGroupEndpointResult {
  permissionGroup: IPublicPermissionGroup;
}

export type CreatePermissionGroupEndpoint = Endpoint<
  IBaseContext,
  ICreatePermissionGroupEndpointParameters,
  ICreatePermissionGroupEndpointResult
>;
