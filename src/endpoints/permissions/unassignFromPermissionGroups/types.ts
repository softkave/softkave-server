import {IPermissionItemEntity} from '../../../mongo/access-control/permissionItem';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export type IUnassignPermissionGroupInputItem = {
  permissionGroupId: string;
  entity: IPermissionItemEntity;
};

export interface IUnassignPermissionGroupsEndpointParameters {
  organizationId: string;
  items: IUnassignPermissionGroupInputItem[];
}

export type UnassignPermissionGroupsEndpoint = Endpoint<
  IBaseContext,
  IUnassignPermissionGroupsEndpointParameters
>;
