import {IPermissionItem} from '../../../mongo/access-control/permissionItem';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IPermissionItemInput} from '../../contexts/data/permission/type';
import {Endpoint} from '../../types';

export interface ICreatePermissionItemsEndpointParameters {
  organizationId: string;
  items: IPermissionItemInput[];
}

export interface ICreatePermissionItemsEndpointResult {
  items: IPermissionItem[];
}

export type CreatePermissionItemsEndpoint = Endpoint<
  IBaseContext,
  ICreatePermissionItemsEndpointParameters,
  ICreatePermissionItemsEndpointResult
>;
