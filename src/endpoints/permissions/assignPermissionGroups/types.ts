import {IPermissionItemEntity} from '../../../mongo/access-control/permissionItem';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export type IAssignPermissionGroupInputItem = {
  permissionGroupId: string;
  entity: IPermissionItemEntity;
  order?: number;
};

export interface IAssignPermissionGroupsEndpointParameters {
  organizationId: string;
  items: IAssignPermissionGroupInputItem[];
}

export type AssignPermissionGroupsEndpoint = Endpoint<
  IBaseContext,
  IAssignPermissionGroupsEndpointParameters
>;
